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
    const hubspotResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    let contactId;
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
      }
    }

    // 2. Crear deal asociado
    if (contactId) {
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
    }

    // 3. Crear nota con la cotización
    if (contactId) {
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
          }
        },
        whatsapp_url: `https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, recibí la cotización ${cotizacion.numero} para el modelo ${datos.modelo}. Me gustaría más información.`
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