const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { contactId, estado, notas } = JSON.parse(event.body);
    const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

    // Actualizar estado del lead
    const updateData = {
      properties: {
        hs_lead_status: estado
      }
    };

    const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Lead actualizado correctamente'
      })
    };

  } catch (error) {
    console.error('Error actualizando lead:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error actualizando lead',
        details: error.message 
      })
    };
  }
};