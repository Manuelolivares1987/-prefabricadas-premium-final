const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const startTime = Date.now();
  const checks = {};

  try {
    // Check HubSpot connection
    checks.hubspot = await checkHubSpot();
    
    // Check UF API
    checks.uf_api = await checkUFAPI();
    
    // System info
    const systemInfo = {
      timestamp: new Date().toISOString(),
      version: process.env.DEPLOY_ID || 'development',
      region: process.env.AWS_REGION || 'us-east-1'
    };

    const allHealthy = Object.values(checks).every(check => check.status === 'ok');

    return {
      statusCode: allHealthy ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        status: allHealthy ? 'healthy' : 'degraded',
        duration: `${Date.now() - startTime}ms`,
        checks,
        system: systemInfo
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        duration: `${Date.now() - startTime}ms`
      })
    };
  }
};

async function checkHubSpot() {
  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
      }
    });
    
    return {
      status: response.ok ? 'ok' : 'error',
      response_time: response.headers.get('x-response-time') || 'unknown'
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

async function checkUFAPI() {
  try {
    const response = await fetch('https://api.boostr.cl/economy/indicator/uf.json');
    const data = await response.json();
    
    return {
      status: data && data.value ? 'ok' : 'error',
      current_value: data?.value || null
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}