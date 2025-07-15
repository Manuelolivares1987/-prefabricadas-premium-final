const fetch = require('node-fetch');

// ==========================================
// SISTEMA DE COTIZACIÓN INTEGRADO EN LA FUNCIÓN
// ==========================================

// Datos de modelos con M² reales - Variantes A
const MODELOS = {
  'Milán': {
    m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0,
    imagen: 'modelos/milan.jpg', dormitorios: 5, baños: 4, pdf: 'pdfs/milan.pdf',
    descripcion: 'Casa familiar de gran tamaño con espacios amplios y distribución premium'
  },
  'Marbella': {
    m2_utiles: 139, m2_terraza: 50, entrepiso: 0, logia: 0,
    imagen: 'modelos/marbella.jpg', dormitorios: 4, baños: 2, pdf: 'pdfs/marbella.pdf',
    descripcion: 'Diseño moderno de 4 dormitorios con amplia terraza'
  },
  'Praga': {
    m2_utiles: 180, m2_terraza: 18, entrepiso: 0, logia: 0,
    imagen: 'modelos/praga.jpg', dormitorios: 4, baños: 3, pdf: 'pdfs/praga.pdf',
    descripcion: 'Casa de 4 dormitorios con distribución eficiente'
  },
  'Barcelona': {
    m2_utiles: 150, m2_terraza: 9, entrepiso: 0, logia: 0,
    imagen: 'modelos/barcelona.jpg', dormitorios: 3, baños: 2, pdf: 'pdfs/barcelona.pdf',
    descripcion: 'Casa mediterránea de 3 dormitorios con estilo clásico'
  },
  'Málaga': {
    m2_utiles: 139, m2_terraza: 25, entrepiso: 0, logia: 0,
    imagen: 'modelos/malaga.jpg', dormitorios: 3, baños: 2, pdf: 'pdfs/malaga.pdf',
    descripcion: 'Diseño compacto y funcional con terraza integrada'
  },
  'Capri': {
    m2_utiles: 92, m2_terraza: 36, entrepiso: 0, logia: 0,
    imagen: 'modelos/capri.jpg', dormitorios: 3, baños: 2, pdf: 'pdfs/capri.pdf',
    descripcion: 'Casa acogedora con terraza generosa para la vida al aire libre'
  },
  'Cádiz': {
    m2_utiles: 114, m2_terraza: 11, entrepiso: 0, logia: 0,
    imagen: 'modelos/cadiz.jpg', dormitorios: 3, baños: 2, pdf: 'pdfs/cadiz.pdf',
    descripcion: 'Casa de tamaño medio con distribución práctica y funcional'
  },
  'Toscana': {
    m2_utiles: 72, m2_terraza: 0, entrepiso: 0, logia: 0,
    imagen: 'modelos/toscana.jpg', dormitorios: 3, baños: 2, pdf: 'pdfs/toscana.pdf',
    descripcion: 'Casa starter perfecta para comenzar, diseño compacto e inteligente'
  },
  'Mónaco': {
    m2_utiles: 132, m2_terraza: 15, entrepiso: 36, logia: 7,
    imagen: 'modelos/monaco.jpg', dormitorios: 3, baños: 2, pdf: 'pdfs/monaco.pdf',
    descripcion: 'Casa de 2 pisos con espacios diferenciados y logia privada'
  },
  'Eclipse': {
    m2_utiles: 86, m2_terraza: 0, entrepiso: 36, logia: 0,
    imagen: 'modelos/eclipse.jpg', dormitorios: 3, baños: 2, pdf: 'pdfs/eclipse.pdf',
    descripcion: 'Diseño moderno de 2 pisos compacto y eficiente'
  },
  'Amalfitano': {
    m2_utiles: 230, m2_terraza: 71, entrepiso: 0, logia: 0,
    imagen: 'modelos/amalfitano.jpg', dormitorios: 4, baños: 3, pdf: 'pdfs/amalfitano.pdf',
    descripcion: 'Casa premium de gran tamaño en un piso con diseño mediterráneo'
  }
};

// Tarifas por m² en UF según materialidad
const TARIFAS = {
  'MADERA_OSB': { util: 3.6, terraza: 2, entrepiso: 0.72, logia: 2.7 },
  'SIP_VOLCANBOARD': { util: 4.6, terraza: 2, entrepiso: 0.72, logia: 3 },
  'METALCON_VOLCANBOARD': { util: 4.6, terraza: 2, entrepiso: 1.72, logia: 3 }
};

// Configuración de sucursales
const SUCURSALES = {
  'La Serena': {
    whatsapp: '+56955278508', nombre: 'La Serena',
    direccion: 'Parcela Vega Sur 53, La Serena',
    email: 'lsanchez@prefabricadaspremium.cl'
  },
  'Casablanca': {
    whatsapp: '+56938886338', nombre: 'Casablanca',
    direccion: 'Ruta 68 Km 75, Casablanca',
    email: 'cmorales@prefabricadaspremium.cl'
  },
  'Copiapó': {
    whatsapp: '+56950573020', nombre: 'Copiapó',
    direccion: 'Sector Piedra Colgada, Copiapó',
    email: 'ffabrega@prefabricadaspremium.cl'
  }
};

// Opciones recomendadas
const OPCIONES_RECOMENDADAS = {
  economica: {
    titulo: 'Panel Madera', subtitulo: 'Madera + OSB',
    descripcion: 'Excelente relación calidad-precio para tu primera casa',
    material: 'MADERA', revestimiento: 'OSB', color: '#6c757d'
  },
  premium: {
    titulo: 'Panel Premium SIP', subtitulo: 'SIP + Volcanboard',
    descripcion: 'Máxima eficiencia energética con aislación incluida',
    material: 'SIP', revestimiento: 'VOLCANBOARD', color: '#28a745', recomendada: true
  },
  estructural: {
    titulo: 'Panel Metalcon', subtitulo: 'Metalcon + Volcanboard',
    descripcion: 'Máxima resistencia sísmica con respaldo CINTAC',
    material: 'METALCON', revestimiento: 'VOLCANBOARD', color: '#0074D9'
  }
};

// ==========================================
// FUNCIONES DEL SISTEMA
// ==========================================

// Obtener valor UF
async function obtenerValorUF() {
  try {
    const response = await fetch('https://mindicador.cl/api/uf');
    const data = await response.json();
    
    if (data && data.serie && data.serie[0]) {
      const valorUF = parseFloat(data.serie[0].valor);
      const fechaUF = new Date(data.serie[0].fecha).toLocaleDateString('es-CL');
      console.log(`UF obtenida: ${valorUF.toLocaleString('es-CL')} (${fechaUF})`);
      return { valor: valorUF, fecha: fechaUF };
    }
  } catch (error) {
    console.error('Error al obtener UF:', error);
  }
  
  // Valor de respaldo
  const valorRespaldo = 37500;
  const fechaRespaldo = new Date().toLocaleDateString('es-CL');
  console.log(`Usando UF de respaldo: ${valorRespaldo.toLocaleString('es-CL')}`);
  return { valor: valorRespaldo, fecha: fechaRespaldo };
}

// Calcular precio para una configuración específica
function calcularPrecioConfiguracion(modelo, material, revestimiento, valorUF) {
  const configuracion = MODELOS[modelo];
  const tarifa = TARIFAS[`${material}_${revestimiento}`];
  
  if (!configuracion || !tarifa) return null;

  let totalUF = 0;

  // Calcular cada tipo de área
  if (configuracion.m2_utiles) totalUF += configuracion.m2_utiles * tarifa.util;
  if (configuracion.m2_terraza) totalUF += configuracion.m2_terraza * tarifa.terraza;
  if (configuracion.entrepiso && tarifa.entrepiso) totalUF += configuracion.entrepiso * tarifa.entrepiso;
  if (configuracion.logia && tarifa.logia) totalUF += configuracion.logia * tarifa.logia;

  return {
    uf: Math.round(totalUF * 100) / 100,
    clp: Math.round(totalUF * valorUF)
  };
}

// Calcular precios para las 3 opciones principales
function calcularPrecios(nombreModelo, valorUF) {
  const precios = {};

  Object.keys(OPCIONES_RECOMENDADAS).forEach(tipoOpcion => {
    const opcion = OPCIONES_RECOMENDADAS[tipoOpcion];
    const precio = calcularPrecioConfiguracion(nombreModelo, opcion.material, opcion.revestimiento, valorUF);
    
    if (precio) {
      precios[tipoOpcion] = { ...precio, opcion: opcion };
    }
  });

  return precios;
}

// Generar número de cotización único
function generarNumeroCotizacion() {
  const fecha = new Date();
  const year = fecha.getFullYear().toString().slice(-2);
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const day = fecha.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PP-${year}${month}${day}-${random}`;
}

// Calcular vigencia (15 días corridos)
function calcularVigencia() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 15);
  return fecha.toLocaleDateString('es-CL');
}

// Generar cotización completa
function generarCotizacion(datosFormulario, uf) {
  const precios = calcularPrecios(datosFormulario.modelo, uf.valor);
  if (!precios) return null;

  const modeloInfo = MODELOS[datosFormulario.modelo];
  const numeroCotizacion = generarNumeroCotizacion();
  const fechaCotizacion = new Date().toLocaleDateString('es-CL');
  const vigencia = calcularVigencia();

  return {
    numero: numeroCotizacion,
    fecha: fechaCotizacion,
    vigencia: vigencia,
    
    cliente: {
      nombre: datosFormulario.nombre,
      email: datosFormulario.correo,
      telefono: datosFormulario.telefono,
      rut: datosFormulario.rut || 'No proporcionado',
      habitaciones_necesarias: datosFormulario.habitaciones || modeloInfo.dormitorios,
      comentarios: datosFormulario.comentario || 'Sin comentarios adicionales'
    },
    
    modelo: {
      nombre: datosFormulario.modelo,
      dormitorios: modeloInfo.dormitorios,
      baños: modeloInfo.baños,
      imagen: modeloInfo.imagen,
      pdf: modeloInfo.pdf,
      m2_utiles: modeloInfo.m2_utiles,
      m2_terraza: modeloInfo.m2_terraza,
      entrepiso: modeloInfo.entrepiso,
      logia: modeloInfo.logia,
      m2_total: modeloInfo.m2_utiles + modeloInfo.m2_terraza + modeloInfo.entrepiso + modeloInfo.logia,
      descripcion: modeloInfo.descripcion
    },
    
    precios: precios,
    uf: uf,
    sucursal: SUCURSALES[datosFormulario.sucursal] || SUCURSALES['La Serena'],
    
    financiamiento: {
      solicitado: datosFormulario.financia === 'si',
      monto: datosFormulario.monto || null,
      rut_financiamiento: datosFormulario.rut || null
    }
  };
}

// ==========================================
// FUNCIÓN PRINCIPAL NETLIFY
// ==========================================

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

  console.log('=== INICIO DE PROCESAMIENTO - SISTEMA INTEGRADO v5.0 ===');

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

    // Configuración
    const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

    // Obtener valor UF
    const uf = await obtenerValorUF();
    console.log('=== UF OBTENIDA ===');
    console.log('Valor UF:', uf.valor);
    console.log('Fecha UF:', uf.fecha);

    // Generar cotización completa
    const cotizacion = generarCotizacion(datos, uf);

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

    console.log('=== COTIZACIÓN GENERADA ===');
    console.log('Número:', cotizacion.numero);
    console.log('Modelo:', cotizacion.modelo.nombre);
    console.log('M² Total:', cotizacion.modelo.m2_total);
    console.log('Precio Panel Madera:', cotizacion.precios.economica?.clp);
    console.log('Precio Panel SIP:', cotizacion.precios.premium?.clp);
    console.log('Precio Panel Metalcon:', cotizacion.precios.estructural?.clp);

    // Variables para resultados de integraciones
    let contactId = null;
    let hubspotResult = { success: false, message: 'No configurado' };
    let emailResult = { success: false, message: 'No intentado' };

    // HUBSPOT - Crear/actualizar contacto (si está configurado)
    if (HUBSPOT_API_KEY) {
      try {
        console.log('=== PROCESANDO HUBSPOT ===');
        
        const contactData = {
          properties: {
            email: datos.correo,
            firstname: datos.nombre.split(' ')[0] || datos.nombre,
            lastname: datos.nombre.split(' ').slice(1).join(' ') || 'Sin apellido',
            phone: datos.telefono,
            company: 'Cliente Prefabricadas Premium',
            lead_source: 'Formulario Web v5.0',
            hs_lead_status: 'NEW',
            message: `Cotización ${cotizacion.numero} | Modelo: ${datos.modelo} (${cotizacion.modelo.m2_total}m²) | 
Panel Madera: $${cotizacion.precios.economica?.clp?.toLocaleString('es-CL')} | 
Panel SIP: $${cotizacion.precios.premium?.clp?.toLocaleString('es-CL')} | 
Panel Metalcon: $${cotizacion.precios.estructural?.clp?.toLocaleString('es-CL')} | 
Sucursal: ${datos.sucursal} | Financiamiento: ${datos.financia === 'si' ? 'Solicitado' : 'No'}`
          }
        };

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
            hubspotResult = { success: false, message: `Error HubSpot: ${updateResponse.status}` };
            console.log('❌ Error HubSpot:', updateResponse.status);
          }
        }

      } catch (hubspotError) {
        console.error('💥 Error HubSpot:', hubspotError);
        hubspotResult = { success: false, message: hubspotError.message };
      }
    }

    // SENDGRID - Enviar email (si está configurado)
    if (SENDGRID_API_KEY) {
      try {
        console.log('=== ENVIANDO EMAIL ===');
        
        const emailPayload = {
          personalizations: [{
            to: [{ email: datos.correo, name: datos.nombre }]
          }],
          from: { 
            email: 'cotizacion@prefabricadaspremium.cl', 
            name: `Prefabricadas Premium - ${cotizacion.sucursal.nombre}` 
          },
          subject: `🏠 Tu Cotización ${cotizacion.numero} - Modelo ${datos.modelo}`,
          content: [{
            type: 'text/html',
            value: `
              <h1>¡Tu cotización está lista!</h1>
              <p><strong>Número:</strong> ${cotizacion.numero}</p>
              <p><strong>Modelo:</strong> ${cotizacion.modelo.nombre} (${cotizacion.modelo.m2_total}m²)</p>
              <p><strong>Vigencia:</strong> ${cotizacion.vigencia}</p>
              
              <h2>Precios:</h2>
              <ul>
                <li>Panel Madera: $${cotizacion.precios.economica?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.economica?.uf} UF)</li>
                <li>Panel Premium SIP: $${cotizacion.precios.premium?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.premium?.uf} UF) ⭐</li>
                <li>Panel Metalcon: $${cotizacion.precios.estructural?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.estructural?.uf} UF)</li>
              </ul>
              
              <p><strong>UF utilizada:</strong> $${uf.valor.toLocaleString('es-CL')} (${uf.fecha})</p>
              
              <p><a href="https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, consultas sobre cotización ${cotizacion.numero}">📱 Continuar por WhatsApp</a></p>
              
              <p><em>Prefabricadas Premium - Tu casa soñada</em></p>
            `
          }]
        };

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        });
        
        if (response.ok) {
          console.log('✅ Email enviado exitosamente');
          emailResult = { success: true, message: 'Email enviado correctamente' };
        } else {
          console.log('❌ Error enviando email:', response.status);
          emailResult = { success: false, message: `Error SendGrid: ${response.status}` };
        }
        
      } catch (emailError) {
        console.error('💥 Error email:', emailError);
        emailResult = { success: false, message: emailError.message };
      }
    }

    console.log('=== RESUMEN FINAL ===');
    console.log('HubSpot:', hubspotResult.success ? '✅' : '❌', hubspotResult.message);
    console.log('Email:', emailResult.success ? '✅' : '❌', emailResult.message);

    // Respuesta exitosa
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
          uf: uf
        },
        integraciones: {
          hubspot: hubspotResult,
          email: emailResult
        },
        whatsapp_url: `https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, recibí la cotización ${cotizacion.numero} para el modelo ${datos.modelo} (${cotizacion.modelo.m2_total}m²). Me gustaría más información.`,
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