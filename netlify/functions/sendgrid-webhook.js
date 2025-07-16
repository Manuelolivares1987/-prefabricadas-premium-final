const { google } = require('googleapis');

// ==========================================
// WEBHOOK PARA TRACKING DE SENDGRID
// ==========================================

/**
 * Configurar cliente de Google Sheets
 */
async function configurarGoogleSheets() {
  try {
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
    };

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return { sheets, auth };
  } catch (error) {
    console.error('Error configurando Google Sheets:', error);
    throw error;
  }
}

/**
 * Buscar fila de cotización por número
 */
async function buscarFilaCotizacion(sheets, numeroCotizacion) {
  try {
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const sheetName = 'Cotizaciones';

    // Obtener todas las filas
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:AG`
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return null;

    // Buscar la fila con el número de cotización
    for (let i = 1; i < rows.length; i++) { // Empezar en 1 para saltar headers
      if (rows[i][0] === numeroCotizacion) { // Columna A = Número Cotización
        return {
          rowIndex: i + 1, // +1 porque Google Sheets empieza en 1
          currentData: rows[i]
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error buscando cotización:', error);
    return null;
  }
}

/**
 * Actualizar estadísticas de tracking en Google Sheets
 */
async function actualizarTrackingEnSheets(numeroCotizacion, tipoEvento) {
  try {
    console.log(`=== ACTUALIZANDO TRACKING: ${tipoEvento} para ${numeroCotizacion} ===`);
    
    const { sheets } = await configurarGoogleSheets();
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const sheetName = 'Cotizaciones';

    // Buscar la fila de la cotización
    const cotizacionInfo = await buscarFilaCotizacion(sheets, numeroCotizacion);
    
    if (!cotizacionInfo) {
      console.log(`❌ No se encontró cotización: ${numeroCotizacion}`);
      return { success: false, message: 'Cotización no encontrada' };
    }

    const { rowIndex, currentData } = cotizacionInfo;
    
    // Índices de columnas (basado en el orden de headers)
    const COLUMNA_APERTURAS = 30; // Columna AE (empezando desde 0)
    const COLUMNA_CLICKS = 31;    // Columna AF
    const COLUMNA_SEGUIMIENTO = 32; // Columna AG

    // Obtener valores actuales
    let aperturas = parseInt(currentData[COLUMNA_APERTURAS] || 0);
    let clicks = parseInt(currentData[COLUMNA_CLICKS] || 0);
    let seguimiento = currentData[COLUMNA_SEGUIMIENTO] || 'Pendiente';

    // Actualizar según el tipo de evento
    if (tipoEvento === 'open') {
      aperturas += 1;
      seguimiento = 'Email Abierto';
    } else if (tipoEvento === 'click') {
      clicks += 1;
      seguimiento = 'Interactivo';
    }

    // Preparar las actualizaciones
    const updates = [
      {
        range: `${sheetName}!AE${rowIndex}`, // Columna Aperturas
        values: [[aperturas]]
      },
      {
        range: `${sheetName}!AF${rowIndex}`, // Columna Clicks
        values: [[clicks]]
      },
      {
        range: `${sheetName}!AG${rowIndex}`, // Columna Seguimiento
        values: [[seguimiento]]
      }
    ];

    // Ejecutar las actualizaciones
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });

    console.log(`✅ Tracking actualizado - ${tipoEvento}: Aperturas: ${aperturas}, Clicks: ${clicks}`);
    return { 
      success: true, 
      message: `Tracking actualizado: ${tipoEvento}`,
      aperturas,
      clicks,
      seguimiento
    };

  } catch (error) {
    console.error('❌ Error actualizando tracking:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Extraer número de cotización de los custom args o subject
 */
function extraerNumeroCotizacion(evento) {
  try {
    // Opción 1: Desde custom_args
    if (evento.cotizacion_numero) {
      return evento.cotizacion_numero;
    }

    // Opción 2: Desde el subject
    if (evento.subject) {
      const match = evento.subject.match(/PP-\d{6}-\d{3}/);
      if (match) {
        return match[0];
      }
    }

    // Opción 3: Desde unique_args (SendGrid a veces mueve los custom_args aquí)
    if (evento.unique_args && evento.unique_args.cotizacion_numero) {
      return evento.unique_args.cotizacion_numero;
    }

    return null;
  } catch (error) {
    console.error('Error extrayendo número de cotización:', error);
    return null;
  }
}

// ==========================================
// FUNCIÓN PRINCIPAL DEL WEBHOOK
// ==========================================

exports.handler = async (event, context) => {
  console.log('=== WEBHOOK SENDGRID TRACKING RECIBIDO ===');

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

  try {
    // Verificar que tenemos las credenciales de Google Sheets
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SPREADSHEET_ID) {
      console.log('❌ Credenciales de Google Sheets no configuradas');
      return {
        statusCode: 200, // Importante: devolver 200 para que SendGrid no reintente
        body: JSON.stringify({ message: 'Credenciales no configuradas' })
      };
    }

    // Parsear los eventos de SendGrid
    let eventos;
    try {
      eventos = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Error parseando eventos:', parseError);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Error parseando eventos' })
      };
    }

    // Asegurarse de que eventos sea un array
    if (!Array.isArray(eventos)) {
      eventos = [eventos];
    }

    console.log(`📨 Procesando ${eventos.length} evento(s)`);

    // Procesar cada evento
    for (const evento of eventos) {
      const tipoEvento = evento.event;
      const timestamp = evento.timestamp;
      const email = evento.email;

      console.log(`📧 Evento: ${tipoEvento} para ${email} en ${timestamp}`);

      // Solo procesar eventos que nos interesan
      if (tipoEvento === 'open' || tipoEvento === 'click') {
        const numeroCotizacion = extraerNumeroCotizacion(evento);
        
        if (numeroCotizacion) {
          console.log(`🎯 Procesando ${tipoEvento} para cotización: ${numeroCotizacion}`);
          
          // Actualizar Google Sheets
          const resultado = await actualizarTrackingEnSheets(numeroCotizacion, tipoEvento);
          
          if (resultado.success) {
            console.log(`✅ ${tipoEvento} procesado exitosamente para ${numeroCotizacion}`);
          } else {
            console.log(`❌ Error procesando ${tipoEvento} para ${numeroCotizacion}: ${resultado.message}`);
          }
        } else {
          console.log(`⚠️ No se pudo extraer número de cotización del evento ${tipoEvento}`);
        }
      } else {
        console.log(`ℹ️ Evento ${tipoEvento} ignorado (no es open ni click)`);
      }
    }

    // Respuesta exitosa
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: `Procesados ${eventos.length} evento(s)`,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('💥 ERROR EN WEBHOOK:', error);
    
    // Importante: siempre devolver 200 para evitar que SendGrid reintente
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Error interno',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};