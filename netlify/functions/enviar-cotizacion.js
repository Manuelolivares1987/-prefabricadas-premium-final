const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const datos = JSON.parse(event.body);
    
    // Validar datos requeridos
    if (!datos.nombre || !datos.correo || !datos.telefono || !datos.modelo) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' })
      };
    }

    // Configuración HubSpot (usar variables de entorno)
    const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
    const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
    
    if (!HUBSPOT_API_KEY) {
      throw new Error('API Key de HubSpot no configurada');
    }

    // Importar el sistema de cotización
    const { SistemaCotizacionCompleto } = require('./sistema-cotizacion');
    const sistema = new SistemaCotizacionCompleto();
    await sistema.init();

    // Debug: Verificar valor UF obtenido
    console.log('=== DEBUG UF ===');
    console.log('Valor UF obtenido:', sistema.valorUF);
    console.log('Fecha UF:', sistema.fechaUF);
    console.log('===============');

    // Generar cotización completa
    const cotizacion = sistema.generarCotizacion({
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      modelo: datos.modelo,
      sucursal: datos.sucursal,
      habitaciones: datos.habitaciones,
      financia: datos.financia,
      monto: datos.monto,
      rut: datos.rut,
      comentario: datos.comentario
    });

    if (!cotizacion) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No se pudo generar la cotización' })
      };
    }

    // Debug: Verificar precios calculados
    console.log('=== DEBUG PRECIOS ===');
    console.log('Económica:', cotizacion.precios.economica?.clp);
    console.log('Premium:', cotizacion.precios.premium?.clp);
    console.log('Estructural:', cotizacion.precios.estructural?.clp);
    console.log('==================');

    // 1. Crear/actualizar contacto en HubSpot
    const contactData = {
      properties: {
        email: datos.correo,
        firstname: datos.nombre.split(' ')[0] || datos.nombre,
        lastname: datos.nombre.split(' ').slice(1).join(' ') || '',
        phone: datos.telefono,
        rut_cliente: datos.rut || 'No proporcionado',
        modelo_interes: datos.modelo,
        precio_economico: cotizacion.precios.economica?.clp || 0,
        precio_premium: cotizacion.precios.premium?.clp || 0,
        precio_estructural: cotizacion.precios.estructural?.clp || 0,
        sucursal_preferida: datos.sucursal,
        numero_cotizacion: cotizacion.numero,
        fecha_cotizacion: cotizacion.fecha,
        financiamiento_solicitado: datos.financia === 'si' ? 'Sí' : 'No',
        monto_financiamiento: datos.monto || 0,
        habitaciones_necesarias: datos.habitaciones,
        comentarios_cliente: datos.comentario || 'Sin comentarios',
        valor_uf_cotizacion: cotizacion.uf.valor,
        vigencia_cotizacion: cotizacion.vigencia,
        lead_source: 'Formulario Web Netlify',
        lifecyclestage: 'lead',
        hs_lead_status: 'NEW'
      }
    };

    // Crear contacto en HubSpot
    let contactId;
    try {
      const hubspotResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      if (hubspotResponse.ok) {
        const contactResult = await hubspotResponse.json();
        contactId = contactResult.id;
        console.log('Contacto creado en HubSpot:', contactId);
      } else {
        // Si falla, intentar actualizar contacto existente
        const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${datos.correo}?idProperty=email`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contactData)
        });
        
        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          contactId = updateResult.id;
          console.log('Contacto actualizado en HubSpot:', contactId);
        } else {
          console.error('Error al crear/actualizar contacto en HubSpot');
        }
      }
    } catch (hubspotError) {
      console.error('Error con HubSpot:', hubspotError);
      // Continuar sin fallar si HubSpot falla
    }

    // 2. Crear deal asociado (solo si se creó el contacto)
    if (contactId) {
      try {
        const dealData = {
          properties: {
            dealname: `Cotización ${datos.modelo} - ${datos.nombre}`,
            dealstage: 'appointmentscheduled',
            pipeline: 'default',
            amount: cotizacion.precios.premium?.clp || cotizacion.precios.economica?.clp,
            modelo_casa: datos.modelo,
            numero_cotizacion: cotizacion.numero,
            sucursal_deal: datos.sucursal,
            tipo_financiamiento: datos.financia === 'si' ? 'Financiado' : 'Contado',
            closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 días
          },
          associations: [{
            to: { id: contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }] // Contact to Deal
          }]
        };

        await fetch(`https://api.hubapi.com/crm/v3/objects/deals`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dealData)
        });
        console.log('Deal creado en HubSpot');
      } catch (dealError) {
        console.error('Error al crear deal:', dealError);
      }
    }

    // 3. Crear nota con la cotización (solo si se creó el contacto)
    if (contactId) {
      try {
        const noteData = {
          properties: {
            hs_note_body: `Cotización automática generada:
            
Modelo: ${datos.modelo}
Número de cotización: ${cotizacion.numero}
Precio Económico: $${cotizacion.precios.economica?.clp.toLocaleString('es-CL') || 'N/A'}
Precio Premium: $${cotizacion.precios.premium?.clp.toLocaleString('es-CL') || 'N/A'}
Precio Estructural: $${cotizacion.precios.estructural?.clp.toLocaleString('es-CL') || 'N/A'}

Habitaciones necesarias: ${datos.habitaciones}
Sucursal preferida: ${datos.sucursal}
Financiamiento: ${datos.financia === 'si' ? 'Sí' : 'No'}
${datos.monto ? `Monto a financiar: $${parseInt(datos.monto).toLocaleString('es-CL')}` : ''}

Comentarios: ${datos.comentario || 'Sin comentarios adicionales'}

Vigencia: ${cotizacion.vigencia}
UF utilizada: $${cotizacion.uf.valor.toLocaleString('es-CL')} (${cotizacion.uf.fecha})`
          },
          associations: [{
            to: { id: contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] // Note to Contact
          }]
        };

        await fetch(`https://api.hubapi.com/crm/v3/objects/notes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(noteData)
        });
        console.log('Nota creada en HubSpot');
      } catch (noteError) {
        console.error('Error al crear nota:', noteError);
      }
    }

    // 4. Enviar email con cotización (NUEVO)
    try {
      await enviarEmailCotizacion({
        to: datos.correo,
        nombre: datos.nombre,
        modelo: datos.modelo,
        numero: cotizacion.numero,
        htmlContent: sistema.generarHTMLCotizacion(cotizacion),
        sucursal: cotizacion.sucursal
      });
      console.log('Email de cotización enviado');
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // No fallar si el email falla, pero loggearlo
    }

    
     return {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    success: true,
    message: 'Cotización enviada exitosamente',
    cotizacion: {
      numero: cotizacion.numero,
      fecha: cotizacion.fecha,
      vigencia: cotizacion.vigencia,
      modelo: datos.modelo,
      precios: {
        economica: cotizacion.precios.economica?.clp,
        premium: cotizacion.precios.premium?.clp,
        estructural: cotizacion.precios.estructural?.clp
      },
      uf: {
        valor: cotizacion.uf.valor,
        fecha: cotizacion.uf.fecha
      }
    },
    whatsapp_url: `https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, recibí la cotización ${cotizacion.numero} para el modelo ${datos.modelo}. Me gustaría más información.`,
    hubspot_contact_id: contactId || null
  })
};

  } catch (error) {
    console.error('Error en función de cotización:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      })
    };
  }
};

// Función para enviar emails usando Netlify Forms o servicios externos
async function enviarEmailCotizacion(emailData) {
  try {
    // OPCIÓN 1: Usar servicio de email externo (recomendado para producción)
    // Aquí puedes integrar SendGrid, Mailgun, o AWS SES
    
    // OPCIÓN 2: Para desarrollo/testing - solo logging
    console.log('=== EMAIL DE COTIZACIÓN ===');
    console.log('Para:', emailData.to);
    console.log('Nombre:', emailData.nombre);
    console.log('Modelo:', emailData.modelo);
    console.log('Número:', emailData.numero);
    console.log('Sucursal:', emailData.sucursal.nombre);
    console.log('==========================');
    
    // TODO: Implementar servicio de email real
    // Ejemplo con SendGrid:
    /*
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailData.to, name: emailData.nombre }]
          }],
          from: { 
            email: emailData.sucursal.email, 
            name: `Prefabricadas Premium - ${emailData.sucursal.nombre}` 
          },
          subject: `Tu Cotización ${emailData.numero} - Modelo ${emailData.modelo}`,
          content: [{
            type: 'text/html',
            value: emailData.htmlContent
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar email con SendGrid');
      }
    }
    */
    
    return { success: true, message: 'Email procesado' };
    
  } catch (error) {
    console.error('Error en enviarEmailCotizacion:', error);
    throw error;
  }
}