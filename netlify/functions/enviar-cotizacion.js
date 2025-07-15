const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  // Logs de debug iniciales
  console.log('=== INICIO DE PROCESAMIENTO - SISTEMA V5.0 ===');
  console.log('Variables de entorno disponibles:', {
    HUBSPOT_API_KEY: !!process.env.HUBSPOT_API_KEY,
    SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY
  });

  try {
    const datos = JSON.parse(event.body);
    console.log('Datos recibidos:', { 
      nombre: datos.nombre, 
      correo: datos.correo, 
      modelo: datos.modelo,
      sucursal: datos.sucursal 
    });
    
    // Validar datos requeridos
    if (!datos.nombre || !datos.correo || !datos.telefono || !datos.modelo) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Faltan campos requeridos' })
      };
    }

    // Configuración HubSpot (OPCIONAL - no falla si no está configurado)
    const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
    
    if (!HUBSPOT_API_KEY) {
      console.log('⚠️ HUBSPOT_API_KEY no configurada - saltando HubSpot');
    }

    // Importar el sistema de cotización actualizado
    const { SistemaCotizacionCompleto } = require('./sistema-cotizacion-completo');
    const sistema = new SistemaCotizacionCompleto();
    await sistema.init();

    // Debug: Verificar valor UF obtenido
    console.log('=== DEBUG UF ===');
    console.log('Valor UF obtenido:', sistema.valorUF);
    console.log('Fecha UF:', sistema.fechaUF);
    console.log('===============');

    // Generar cotización completa con el sistema actualizado
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'No se pudo generar la cotización para el modelo especificado' })
      };
    }

    // Debug: Verificar precios calculados con el nuevo sistema
    console.log('=== DEBUG PRECIOS ACTUALIZADOS ===');
    console.log('Modelo:', datos.modelo);
    console.log('M² Útiles:', cotizacion.modelo.m2_utiles);
    console.log('M² Terraza:', cotizacion.modelo.m2_terraza);
    console.log('Entrepiso:', cotizacion.modelo.entrepiso);
    console.log('Logia:', cotizacion.modelo.logia);
    console.log('M² Total:', cotizacion.modelo.m2_total);
    console.log('Económica (Madera+OSB):', cotizacion.precios.economica?.clp);
    console.log('Premium (SIP+Volcanboard):', cotizacion.precios.premium?.clp);
    console.log('Estructural (Metalcon+Volcanboard):', cotizacion.precios.estructural?.clp);
    console.log('==================================');

    // Variables para resultados de integraciones
    let contactId = null;
    let hubspotResult = { success: false, message: 'No configurado' };
    let emailResult = { success: false, message: 'No intentado' };

    // 1. HUBSPOT - Crear/actualizar contacto (solo si está configurado)
    if (HUBSPOT_API_KEY) {
      try {
        console.log('=== HUBSPOT PROCESO ===');
        
        const contactData = {
          properties: {
            email: datos.correo,
            firstname: datos.nombre.split(' ')[0] || datos.nombre,
            lastname: datos.nombre.split(' ').slice(1).join(' ') || 'Sin apellido',
            phone: datos.telefono,
            company: 'Cliente Prefabricadas Premium',
            // Solo propiedades estándar de HubSpot
            lead_source: 'Formulario Web',
            hs_lead_status: 'NEW',
            // Info detallada en campo mensaje (existe por defecto)
            message: `Cotización ${cotizacion.numero} | Modelo: ${datos.modelo} (${cotizacion.modelo.m2_total}m²) | Sucursal: ${datos.sucursal} | 
            
Precios calculados:
• Panel Madera: $${cotizacion.precios.economica?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.economica?.uf} UF)
• Panel Premium SIP: $${cotizacion.precios.premium?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.premium?.uf} UF)
• Panel Metalcon: $${cotizacion.precios.estructural?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.estructural?.uf} UF)

Detalles modelo:
• ${cotizacion.modelo.m2_utiles}m² útiles
• ${cotizacion.modelo.m2_terraza}m² terraza  
• ${cotizacion.modelo.entrepiso}m² entrepiso
• ${cotizacion.modelo.logia}m² logia

Financiamiento: ${datos.financia === 'si' ? 'Solicitado' : 'No solicitado'}
${datos.monto ? `Monto: $${parseInt(datos.monto).toLocaleString('es-CL')}` : ''}
Habitaciones necesarias: ${datos.habitaciones}
RUT: ${datos.rut || 'No proporcionado'}
Comentarios: ${datos.comentario || 'Sin comentarios'}

UF utilizada: $${cotizacion.uf.valor?.toLocaleString('es-CL')} (${cotizacion.uf.fecha})
Vigencia: ${cotizacion.vigencia}`
          }
        };

        console.log('Intentando crear contacto en HubSpot...');
        
        // Intentar crear contacto
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
          hubspotResult = { success: true, message: 'Contacto creado correctamente' };
          console.log('✅ Contacto creado en HubSpot:', contactId);
        } else {
          console.log('❌ Error al crear contacto, intentando actualizar...');
          
          // Intentar actualizar contacto existente
          const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(datos.correo)}?idProperty=email`, {
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
            hubspotResult = { success: true, message: 'Contacto actualizado correctamente' };
            console.log('✅ Contacto actualizado en HubSpot:', contactId);
          } else {
            const errorText = await updateResponse.text();
            hubspotResult = { success: false, message: `Error HubSpot: ${updateResponse.status}` };
            console.log('❌ Error al actualizar contacto:', updateResponse.status, errorText);
          }
        }

        // 2. Crear deal si el contacto se creó/actualizó
        if (contactId) {
          try {
            const dealData = {
              properties: {
                dealname: `Cotización ${datos.modelo} (${cotizacion.modelo.m2_total}m²) - ${datos.nombre}`,
                dealstage: 'appointmentscheduled',
                pipeline: 'default',
                amount: (cotizacion.precios.premium?.clp || cotizacion.precios.economica?.clp || 0).toString(),
                closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              },
              associations: [{
                to: { id: contactId },
                types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
              }]
            };

            const dealResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/deals`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dealData)
            });

            if (dealResponse.ok) {
              console.log('✅ Deal creado en HubSpot');
              hubspotResult.deal = true;
            } else {
              console.log('⚠️ Deal no creado');
            }
          } catch (dealError) {
            console.error('Error creando deal:', dealError);
          }

          // 3. Crear nota detallada con la cotización
          try {
            const noteData = {
              properties: {
                hs_note_body: `Cotización automática generada - Sistema V5.0:
                
MODELO: ${datos.modelo}
Número de cotización: ${cotizacion.numero}
Fecha: ${cotizacion.fecha}
Vigencia: ${cotizacion.vigencia}

DETALLES DEL MODELO:
• Dormitorios: ${cotizacion.modelo.dormitorios}
• Baños: ${cotizacion.modelo.baños}
• M² Útiles: ${cotizacion.modelo.m2_utiles}
• M² Terraza: ${cotizacion.modelo.m2_terraza}
• M² Entrepiso: ${cotizacion.modelo.entrepiso}
• M² Logia: ${cotizacion.modelo.logia}
• M² TOTAL: ${cotizacion.modelo.m2_total}

PRECIOS CALCULADOS:
• Panel Madera (Madera+OSB): $${cotizacion.precios.economica?.clp?.toLocaleString('es-CL') || 'N/A'} (${cotizacion.precios.economica?.uf || 'N/A'} UF)
• Panel Premium SIP (SIP+Volcanboard): $${cotizacion.precios.premium?.clp?.toLocaleString('es-CL') || 'N/A'} (${cotizacion.precios.premium?.uf || 'N/A'} UF)
• Panel Metalcon (Metalcon+Volcanboard): $${cotizacion.precios.estructural?.clp?.toLocaleString('es-CL') || 'N/A'} (${cotizacion.precios.estructural?.uf || 'N/A'} UF)

INFORMACIÓN DEL CLIENTE:
Habitaciones necesarias: ${datos.habitaciones}
Sucursal preferida: ${datos.sucursal}
Financiamiento: ${datos.financia === 'si' ? 'Sí' : 'No'}
${datos.monto ? `Monto a financiar: $${parseInt(datos.monto).toLocaleString('es-CL')}` : ''}
RUT: ${datos.rut || 'No proporcionado'}

Comentarios: ${datos.comentario || 'Sin comentarios adicionales'}

DATOS TÉCNICOS:
UF utilizada: $${cotizacion.uf.valor?.toLocaleString('es-CL')} (${cotizacion.uf.fecha})
Sistema de cálculo: V5.0 - M² reales por materialidad

NOTA: Esta cotización incluye solo las 3 opciones principales. Existen múltiples variantes adicionales para cada modelo.`
              },
              associations: [{
                to: { id: contactId },
                types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }]
              }]
            };

            const noteResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/notes`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(noteData)
            });

            if (noteResponse.ok) {
              console.log('✅ Nota detallada creada en HubSpot');
              hubspotResult.note = true;
            } else {
              console.log('⚠️ Nota no creada');
            }
          } catch (noteError) {
            console.error('Error creando nota:', noteError);
          }
        }

      } catch (hubspotError) {
        console.error('💥 Error general HubSpot:', hubspotError);
        hubspotResult = { success: false, message: hubspotError.message };
      }
    }

    // 4. SENDGRID - Enviar email con cotización actualizada
    try {
      emailResult = await enviarEmailCotizacion({
        to: datos.correo,
        nombre: datos.nombre,
        modelo: datos.modelo,
        numero: cotizacion.numero,
        htmlContent: sistema.generarHTMLCotizacion(cotizacion),
        sucursal: cotizacion.sucursal,
        pdfPlanta: cotizacion.modelo.pdf  // Información del PDF del plano
      });
      console.log('Email resultado:', emailResult);
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      emailResult = { success: false, message: emailError.message };
    }

    console.log('=== RESUMEN FINAL ===');
    console.log('HubSpot:', hubspotResult.success ? '✅' : '❌', hubspotResult.message);
    console.log('Email:', emailResult.success ? '✅' : '❌', emailResult.message);
    console.log('==================');

    // Respuesta exitosa con todos los estados actualizados
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Cotización procesada exitosamente',
        cotizacion: {
          numero: cotizacion.numero,
          fecha: cotizacion.fecha,
          vigencia: cotizacion.vigencia,
          modelo: datos.modelo,
          modelo_info: {  
            nombre: cotizacion.modelo.nombre,
            dormitorios: cotizacion.modelo.dormitorios,
            baños: cotizacion.modelo.baños,
            m2_utiles: cotizacion.modelo.m2_utiles,
            m2_terraza: cotizacion.modelo.m2_terraza,
            entrepiso: cotizacion.modelo.entrepiso,
            logia: cotizacion.modelo.logia,
            m2_total: cotizacion.modelo.m2_total,
            pdf: cotizacion.modelo.pdf,
            descripcion: cotizacion.modelo.descripcion
          },
          precios: {
            economica: cotizacion.precios.economica?.clp,
            premium: cotizacion.precios.premium?.clp,
            estructural: cotizacion.precios.estructural?.clp
          },
          precios_uf: {
            economica: cotizacion.precios.economica?.uf,
            premium: cotizacion.precios.premium?.uf,
            estructural: cotizacion.precios.estructural?.uf
          },
          uf: {
            valor: cotizacion.uf.valor,
            fecha: cotizacion.uf.fecha
          }
        },
        integraciones: {
          hubspot: hubspotResult,
          email: emailResult
        },
        whatsapp_url: `https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, recibí la cotización ${cotizacion.numero} para el modelo ${datos.modelo} (${cotizacion.modelo.m2_total}m²). Me gustaría más información y conocer otras opciones disponibles.`,
        hubspot_contact_id: contactId || null
      })
    };

  } catch (error) {
    console.error('💥 ERROR GENERAL:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

// FUNCIÓN PARA ENVIAR EMAILS CON SENDGRID - Actualizada
async function enviarEmailCotizacion(emailData) {
  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    
    console.log('=== ENVIANDO EMAIL ACTUALIZADO ===');
    console.log('Para:', emailData.to);
    console.log('Nombre:', emailData.nombre);
    console.log('Modelo:', emailData.modelo);
    console.log('Número:', emailData.numero);
    console.log('PDF Planta:', emailData.pdfPlanta);
    console.log('SendGrid configurado:', !!SENDGRID_API_KEY);
    console.log('=================================');
    
    // Enviar con SendGrid si está configurado
    if (SENDGRID_API_KEY) {
      const emailPayload = {
        personalizations: [{
          to: [{ 
            email: emailData.to, 
            name: emailData.nombre 
          }]
        }],
        from: { 
          email: 'cotizacion@prefabricadaspremium.cl', 
          name: `Prefabricadas Premium - ${emailData.sucursal.nombre}` 
        },
        subject: `🏠 Tu Cotización ${emailData.numero} - Modelo ${emailData.modelo} con Planta PDF`,
        content: [{
          type: 'text/html',
          value: emailData.htmlContent
        }]
      };

      console.log('Enviando email via SendGrid...');
      
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });
      
      if (response.ok) {
        console.log('✅ Email enviado exitosamente via SendGrid');
        return { success: true, message: 'Email enviado via SendGrid con planta PDF', method: 'sendgrid' };
      } else {
        const errorText = await response.text();
        console.error('❌ Error de SendGrid:', response.status, errorText);
        throw new Error(`SendGrid error: ${response.status} - ${errorText}`);
      }
    } else {
      console.warn('⚠️ SendGrid API Key no configurada');
      return { success: false, message: 'SendGrid no configurado', method: 'none' };
    }
    
  } catch (error) {
    console.error('💥 Error en enviarEmailCotizacion:', error);
    return { 
      success: false, 
      message: `Error al enviar email: ${error.message}`,
      method: 'error'
    };
  }
}