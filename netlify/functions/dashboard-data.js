const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
    
    if (!HUBSPOT_API_KEY) {
      throw new Error('API Key de HubSpot no configurada');
    }

    // 1. Obtener contactos recientes (últimos 30 días)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime();
    
    const contactsResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts?properties=firstname,lastname,email,phone,createdate,modelo_interes,sucursal_preferida,numero_cotizacion,financiamiento_solicitado,hs_lead_status&limit=100&sorts=createdate&filterGroups=[{"filters":[{"propertyName":"createdate","operator":"GTE","value":"${thirtyDaysAgo}"}]}]`, {
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const contactsData = await contactsResponse.json();

    // 2. Obtener deals activos
    const dealsResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/deals?properties=dealname,amount,dealstage,modelo_casa,numero_cotizacion,sucursal_deal,createdate,closedate&limit=100`, {
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const dealsData = await dealsResponse.json();

    // 3. Calcular estadísticas
    const contacts = contactsData.results || [];
    const deals = dealsData.results || [];

    // Estadísticas de leads
    const totalLeads = contacts.length;
    const leadsHoy = contacts.filter(c => {
      const createDate = new Date(c.properties.createdate);
      const today = new Date();
      return createDate.toDateString() === today.toDateString();
    }).length;

    const leadsPorSucursal = contacts.reduce((acc, contact) => {
      const sucursal = contact.properties.sucursal_preferida || 'Sin especificar';
      acc[sucursal] = (acc[sucursal] || 0) + 1;
      return acc;
    }, {});

    const modelosMasSolicitados = contacts.reduce((acc, contact) => {
      const modelo = contact.properties.modelo_interes || 'Sin especificar';
      acc[modelo] = (acc[modelo] || 0) + 1;
      return acc;
    }, {});

    // Estadísticas de deals
    const totalDeals = deals.length;
    const dealsActivos = deals.filter(d => !['closedwon', 'closedlost'].includes(d.properties.dealstage)).length;
    const dealsCerrados = deals.filter(d => d.properties.dealstage === 'closedwon').length;
    
    const valorTotalPipeline = deals
      .filter(d => d.properties.dealstage !== 'closedlost')
      .reduce((sum, deal) => sum + (parseFloat(deal.properties.amount) || 0), 0);

    // Leads por estado
    const leadsPorEstado = contacts.reduce((acc, contact) => {
      const estado = contact.properties.hs_lead_status || 'NEW';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    // Conversión semanal (últimas 4 semanas)
    const conversionSemanal = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      
      const leadsWeek = contacts.filter(c => {
        const createDate = new Date(c.properties.createdate);
        return createDate >= weekStart && createDate < weekEnd;
      }).length;

      const dealsWeek = deals.filter(d => {
        const createDate = new Date(d.properties.createdate);
        return createDate >= weekStart && createDate < weekEnd;
      }).length;

      conversionSemanal.unshift({
        semana: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        leads: leadsWeek,
        deals: dealsWeek,
        conversion: leadsWeek > 0 ? Math.round((dealsWeek / leadsWeek) * 100) : 0
      });
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        resumen: {
          totalLeads,
          leadsHoy,
          totalDeals,
          dealsActivos,
          dealsCerrados,
          valorTotalPipeline,
          tasaConversion: totalLeads > 0 ? Math.round((totalDeals / totalLeads) * 100) : 0
        },
        distribucion: {
          leadsPorSucursal,
          modelosMasSolicitados,
          leadsPorEstado
        },
        tendencias: {
          conversionSemanal
        },
        leadsRecientes: contacts.slice(0, 10).map(c => ({
          nombre: `${c.properties.firstname || ''} ${c.properties.lastname || ''}`.trim(),
          email: c.properties.email,
          telefono: c.properties.phone,
          modelo: c.properties.modelo_interes,
          sucursal: c.properties.sucursal_preferida,
          cotizacion: c.properties.numero_cotizacion,
          financiamiento: c.properties.financiamiento_solicitado,
          estado: c.properties.hs_lead_status,
          fecha: new Date(c.properties.createdate).toLocaleDateString('es-CL')
        }))
      })
    };

  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error obteniendo datos del dashboard',
        details: error.message 
      })
    };
  }
};