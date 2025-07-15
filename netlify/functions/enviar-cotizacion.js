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

// Opciones recomendadas CON LO QUE INCLUYE
const OPCIONES_RECOMENDADAS = {
  economica: {
    titulo: 'Panel Madera', 
    subtitulo: 'Madera + OSB',
    descripcion: 'Excelente relación calidad-precio para tu primera casa',
    material: 'MADERA', 
    revestimiento: 'OSB', 
    color: '#6c757d',
    icono: '🏠',
    incluye: [
      'Estructura de madera con certificación estructural',
      'Certificación de impregnación al vacío',
      'Revestimiento OSB resistente a la humedad',
      'Kit de autoconstrucción completo',
      'Asesoría técnica con I.T.O',
      'Listado de maestros calificados',
      'Manual de montaje detallado',
      'Herrajes y fijaciones especializadas',
      'Garantía de materiales estructurales',
      'Soporte técnico durante construcción'
    ]
  },
  premium: {
    titulo: 'Panel Premium SIP', 
    subtitulo: 'SIP + Volcanboard',
    descripcion: 'Máxima eficiencia energética con aislación incluida',
    material: 'SIP', 
    revestimiento: 'VOLCANBOARD', 
    color: '#28a745', 
    recomendada: true,
    icono: '⭐',
    incluye: [
      'Paneles SIP (Structural Insulated Panels)',
      'Aislación térmica premium incluida',
      'Certificado IDIEM al corte del panel',
      'Volcanboard 8mm fibrocemento ambas caras',
      'Sistema de construcción rápida',
      'Kit completo con herrajes especializados',
      'Asesoría técnica especializada en SIP',
      'Manual técnico de instalación SIP',
      'Garantía extendida de paneles',
      'Máxima eficiencia energética'
    ]
  },
  estructural: {
    titulo: 'Panel Metalcon', 
    subtitulo: 'Metalcon + Volcanboard',
    descripcion: 'Máxima resistencia sísmica con respaldo CINTAC',
    material: 'METALCON', 
    revestimiento: 'VOLCANBOARD', 
    color: '#0074D9',
    icono: '🔩',
    incluye: [
      'Estructura Steel Frame CINTAC',
      'Respaldo técnico de CINTAC',
      'Volcanboard estructural 8mm',
      'Sistema antisísmico reforzado',
      'Perfiles galvanizados certificados',
      'Kit de fijaciones especializado',
      'Asesoría técnica CINTAC',
      'Manual de construcción Steel Frame',
      'Certificación de resistencia sísmica',
      'Garantía estructural extendida'
    ]
  }
};

// Preguntas frecuentes
const PREGUNTAS_FRECUENTES = [
  {
    categoria: 'Construcción y Calidad',
    preguntas: [
      {
        pregunta: '¿Cuánto tiempo demora la construcción?',
        respuesta: 'La fabricación toma 6-8 semanas en condiciones controladas de fábrica, más 1-2 semanas de montaje en sitio. Total: 2-3 meses versus 6-12 meses de construcción tradicional.'
      },
      {
        pregunta: '¿Trabajan con materiales certificados?',
        respuesta: 'Sí, nuestros materiales cuentan con certificación para cada mundo constructivo: Madera (Certificación estructural y de impregnación al vacío), Metalcon (Respaldo de CINTAC), Premium SIP (Certificado al corte por IDIEM).'
      },
      {
        pregunta: '¿Qué otros modelos y tamaños tienen disponibles?',
        respuesta: 'Además de las opciones mostradas, tenemos múltiples variantes para cada modelo con diferentes metrajes y configuraciones. Consulta con tu agente de ventas por todas las opciones disponibles según tus necesidades específicas.'
      }
    ]
  },
  {
    categoria: 'Financiamiento',
    preguntas: [
      {
        pregunta: '¿Puedo financiar mi casa prefabricada?',
        respuesta: 'Sí, trabajamos con SALVUM donde, bajo evaluación crediticia, puedes financiar hasta en 60 cuotas. También te asesoramos en la postulación a subsidios DS1, DS49 y DS19 sin costo adicional.'
      },
      {
        pregunta: '¿Cómo funciona el pago por etapas?',
        respuesta: 'Todos nuestros proyectos se pueden comprar a través de etapas, donde alrededor del 50% del proyecto se paga una semana antes de la entrega. El resto se puede financiar según las condiciones acordadas.'
      }
    ]
  },
  {
    categoria: 'Materialidad y Servicios',
    preguntas: [
      {
        pregunta: '¿Qué incluye? / ¿Trabajan llave en mano?',
        respuesta: 'Podemos realizar el radier y armar tu proyecto, o entregarte el KIT de autoconstrucción con asesoría de un I.T.O (Inspector Técnico de Obra) y listado de maestros calificados.'
      },
      {
        pregunta: '¿Qué incluye el kit y qué no?',
        respuesta: 'Incluimos estructura, revestimientos y herrajes para obra gruesa. NO incluye: electricidad, gasfitería, pavimentos, puertas, ventanas. Aislación solo incluida en Panel SIP. Tenemos alianzas para adquirir especialidades a precios económicos.'
      }
    ]
  }
];

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
    uf: Math.ceil(totalUF), // Redondear hacia arriba para números cerrados
    clp: Math.round(Math.ceil(totalUF) * valorUF) // Usar UF redondeada hacia arriba
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
      m2_total: modeloInfo.m2_utiles + modeloInfo.m2_terraza + modeloInfo.logia,
      descripcion: modeloInfo.descripcion
    },
    
    precios: precios,
    uf: uf,
    sucursal: SUCURSALES[datosFormulario.sucursal] || SUCURSALES['La Serena'],
    
    financiamiento: {
      solicitado: datosFormulario.financia === 'si',
      monto: datosFormulario.monto || null,
      rut_financiamiento: datosFormulario.rut || null
    },

    preguntas_frecuentes: PREGUNTAS_FRECUENTES
  };
}

// Generar HTML profesional para email MÓVIL-OPTIMIZADO
function generarHTMLEmailCompleto(cotizacion) {
  const preciosOrdenados = ['economica', 'premium', 'estructural'].map(tipo => ({
    tipo,
    ...cotizacion.precios[tipo]
  })).filter(precio => precio.uf);

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Language" content="es">
      <meta name="language" content="Spanish">
      <meta name="x-apple-disable-message-reformatting">
      <title>Cotización Prefabricadas Premium - Modelo ${cotizacion.modelo.nombre}</title>
      <!--[if mso]>
      <noscript>
          <xml>
              <o:OfficeDocumentSettings>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
          </xml>
      </noscript>
      <![endif]-->
      <style>
          /* RESET PARA EMAIL - ESPAÑOL OPTIMIZADO */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
              font-family: Arial, Helvetica, sans-serif; 
              line-height: 1.4; 
              color: #333; 
              background: #f5f5f5;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
              direction: ltr;
              text-align: left;
          }
          
          table { 
              border-collapse: collapse; 
              mso-table-lspace: 0pt; 
              mso-table-rspace: 0pt; 
              width: 100%;
          }
          
          td {
              border-collapse: collapse;
              mso-line-height-rule: exactly;
          }
          
          /* PREVENIR TRADUCCIÓN AUTOMÁTICA DE ESTRUCTURA */
          .no-translate {
              -webkit-transform: translateZ(0);
              transform: translateZ(0);
          }
          
          .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 10px; 
              overflow: hidden;
          }
          
          /* HEADER */
          .header { 
              background: linear-gradient(135deg, #8B5A3C 0%, #A67C52 100%); 
              color: white; 
              padding: 25px 20px; 
              text-align: center; 
          }
          .header h1 { 
              font-size: 22px; 
              margin-bottom: 8px; 
              font-weight: bold; 
          }
          .header p { 
              font-size: 16px; 
              opacity: 0.9; 
          }
          
          /* SECCIONES */
          .section { 
              padding: 20px; 
              border-bottom: 1px solid #eee; 
          }
          .section:last-child { border-bottom: none; }
          
          .section-title { 
              color: #8B5A3C; 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 15px; 
              border-bottom: 2px solid #D4B896;
              padding-bottom: 5px;
          }
          
          /* INFORMACIÓN CLIENTE */
          .info-grid { 
              display: block;
          }
          .info-item { 
              background: #f8f9fa; 
              padding: 12px; 
              margin-bottom: 8px;
              border-radius: 6px; 
              border-left: 4px solid #8B5A3C; 
          }
          .info-item strong { 
              display: block; 
              color: #8B5A3C; 
              font-size: 14px; 
              margin-bottom: 3px; 
          }
          .info-item span {
              font-size: 15px;
              color: #333;
          }
          
          /* MODELO */
          .modelo-info {
              text-align: center;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
              margin-bottom: 15px;
          }
          .modelo-info h2 { 
              color: #8B5A3C; 
              font-size: 24px; 
              margin-bottom: 10px; 
          }
          .modelo-specs { 
              display: flex; 
              flex-wrap: wrap;
              justify-content: center;
              gap: 8px; 
              margin-bottom: 15px; 
          }
          .spec { 
              background: #D4B896; 
              padding: 6px 12px; 
              border-radius: 15px; 
              font-weight: 600; 
              color: #8B5A3C; 
              font-size: 13px;
          }
          .modelo-descripcion {
              color: #666;
              font-style: italic;
              margin-top: 10px;
          }
          
          /* PLANTA PDF */
          .planta-section {
              background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
              border: 2px solid #28a745;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 15px 0;
          }
          .planta-btn {
              display: inline-block;
              background: #28a745;
              color: white;
              padding: 12px 25px;
              border-radius: 25px;
              text-decoration: none;
              font-weight: bold;
              margin-top: 10px;
              font-size: 16px;
          }
          
          /* PRECIOS */
          .precio-card { 
              background: white; 
              border: 2px solid #eee;
              border-radius: 10px; 
              padding: 20px; 
              margin-bottom: 15px;
              position: relative;
          }
          .precio-card.premium { 
              border-color: #28a745; 
              background: #f8fff8;
          }
          .precio-card.premium::before { 
              content: '⭐ MÁS POPULAR'; 
              position: absolute; 
              top: -12px; 
              left: 15px; 
              background: #28a745; 
              color: white; 
              padding: 4px 12px; 
              border-radius: 15px; 
              font-size: 12px; 
              font-weight: bold; 
          }
          .precio-titulo { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 5px; 
              text-align: center; 
          }
          .precio-subtitulo { 
              font-size: 14px; 
              opacity: 0.7; 
              text-align: center; 
              margin-bottom: 15px; 
          }
          .precio-valor { 
              text-align: center; 
              margin: 15px 0; 
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
          }
          .precio-clp { 
              font-size: 20px; 
              font-weight: bold; 
              color: #8B5A3C; 
              display: block; 
          }
          .precio-uf { 
              font-size: 14px; 
              color: #666; 
              margin-top: 5px; 
          }
          .precio-iva {
              font-size: 16px;
              color: #e74c3c;
              font-weight: bold;
              margin-top: 5px;
              display: block;
          }
          .incluye-lista { 
              list-style: none; 
              padding: 0; 
              margin-top: 10px;
          }
          .incluye-lista li { 
              padding: 4px 0; 
              position: relative; 
              padding-left: 18px; 
              font-size: 13px;
              line-height: 1.3;
          }
          .incluye-lista li::before { 
              content: '• '; 
              position: absolute; 
              left: 0; 
              color: #28a745; 
              font-weight: bold; 
          }
          
          /* AVISOS */
          .aviso { 
              background: #fff3cd; 
              border: 2px solid #ffeaa7; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 15px 0; 
              text-align: center; 
          }
          .aviso.vigencia { 
              background: #d1ecf1; 
              border-color: #bee5eb; 
              color: #0c5460; 
          }
          .aviso.importante {
              background: #f8d7da;
              border-color: #f5c6cb;
              color: #721c24;
          }
          
          /* FINANCIAMIENTO */
          .financiamiento-info {
              background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
              padding: 20px;
              border-radius: 8px;
              border: 2px solid #28a745;
              margin: 15px 0;
          }
          
          /* WHATSAPP */
          .whatsapp-section {
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
              padding: 20px;
              text-align: center;
              margin: 15px 0;
              border-radius: 8px;
          }
          .whatsapp-btn {
              display: inline-block;
              background: white;
              color: #25D366;
              padding: 12px 25px;
              border-radius: 25px;
              text-decoration: none;
              font-weight: bold;
              margin-top: 10px;
              font-size: 16px;
          }
          
          /* FAQ */
          .faq-categoria {
              margin-bottom: 20px;
          }
          .faq-categoria h4 {
              color: #28a745;
              font-size: 16px;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 2px solid #28a745;
          }
          .faq-item { 
              margin-bottom: 12px; 
              padding: 12px;
              background: #f8f9fa;
              border-radius: 6px;
          }
          .faq-pregunta { 
              font-weight: bold; 
              color: #8B5A3C; 
              margin-bottom: 5px; 
              font-size: 14px; 
          }
          .faq-respuesta { 
              color: #555; 
              line-height: 1.4; 
              font-size: 13px;
          }
          
          /* FOOTER */
          .footer { 
              background: #333; 
              color: white; 
              padding: 20px; 
              text-align: center; 
          }
          .footer h3 { 
              margin-bottom: 10px; 
              font-size: 18px;
          }
          .footer p { 
              margin: 5px 0; 
              opacity: 0.9; 
              font-size: 14px;
          }
          
          /* RESPONSIVE MÓVIL */
          @media only screen and (max-width: 480px) {
              .container { 
                  margin: 0; 
                  border-radius: 0; 
                  width: 100% !important;
              }
              .header { padding: 20px 15px; }
              .header h1 { font-size: 20px; }
              .section { padding: 15px; }
              .precio-clp { font-size: 18px; }
              .modelo-specs { 
                  flex-direction: column; 
                  align-items: center;
              }
              .spec {
                  display: inline-block;
                  margin: 2px;
              }
          }
      </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
          <tr>
              <td align="center" style="padding: 20px 10px;">
                  <div class="container no-translate">
                      
                      <!-- HEADER -->
                      <div class="header">
                          <h1>COTIZACIÓN PREFABRICADAS PREMIUM</h1>
                          <p>Cotización Número ${cotizacion.numero} | Fecha ${cotizacion.fecha}</p>
                      </div>
                      
                      <!-- INFORMACIÓN DEL CLIENTE -->
                      <div class="section">
                          <h3 class="section-title">Información del Cliente</h3>
                          <div class="info-grid">
                              <div class="info-item">
                                  <strong>Nombre:</strong>
                                  <span>${cotizacion.cliente.nombre}</span>
                              </div>
                              <div class="info-item">
                                  <strong>Email:</strong>
                                  <span>${cotizacion.cliente.email}</span>
                              </div>
                              <div class="info-item">
                                  <strong>Teléfono:</strong>
                                  <span>${cotizacion.cliente.telefono}</span>
                              </div>
                              <div class="info-item">
                                  <strong>Sucursal:</strong>
                                  <span>${cotizacion.sucursal.nombre}</span>
                              </div>
                              <div class="info-item">
                                  <strong>Habitaciones Necesarias:</strong>
                                  <span>${cotizacion.cliente.habitaciones_necesarias}</span>
                              </div>
                              ${cotizacion.cliente.rut !== 'No proporcionado' ? `
                              <div class="info-item">
                                  <strong>RUT:</strong>
                                  <span>${cotizacion.cliente.rut}</span>
                              </div>
                              ` : ''}
                              ${cotizacion.cliente.comentarios !== 'Sin comentarios adicionales' ? `
                              <div class="info-item">
                                  <strong>Comentarios:</strong>
                                  <span>${cotizacion.cliente.comentarios}</span>
                              </div>
                              ` : ''}
                          </div>
                      </div>
                      
                      <!-- MODELO Y PLANTA -->
                      <div class="section">
                          <h3 class="section-title">Modelo Seleccionado</h3>
                          <div class="modelo-info">
                              <h2>${cotizacion.modelo.nombre}</h2>
                              <div class="modelo-specs">
                                  <span class="spec">${cotizacion.modelo.dormitorios} Dormitorios</span>
                                  <span class="spec">${cotizacion.modelo.baños} Baños</span>
                                  <span class="spec">${cotizacion.modelo.m2_total}m² Total</span>
                                  <span class="spec">${cotizacion.modelo.m2_utiles}m² Útiles</span>
                                  ${cotizacion.modelo.m2_terraza ? `<span class="spec">${cotizacion.modelo.m2_terraza}m² Terraza</span>` : ''}
                                  ${cotizacion.modelo.logia ? `<span class="spec">${cotizacion.modelo.logia}m² Logia</span>` : ''}
                                  ${cotizacion.modelo.entrepiso ? `<span class="spec">${cotizacion.modelo.entrepiso}m² Entrepiso</span>` : ''}
                              </div>
                              <p class="modelo-descripcion">${cotizacion.modelo.descripcion}</p>
                          </div>
                          
                          <!-- PLANTA PDF -->
                          <div class="planta-section">
                              <h4 style="color: #155724; margin-bottom: 10px;">Planta Técnica del Modelo</h4>
                              <p>Descarga la planta técnica completa con dimensiones y distribución:</p>
                              <a href="https://catalogo2025premium.netlify.app/${cotizacion.modelo.pdf}" class="planta-btn" target="_blank">
                                  Descargar Planta PDF
                              </a>
                              <p style="margin-top: 10px; font-size: 12px; color: #666;">
                                  <em>Archivo PDF con planos técnicos, dimensiones y especificaciones</em>
                              </p>
                          </div>
                      </div>
                      
                      <!-- OPCIONES DE PRECIOS -->
                      <div class="section">
                          <h3 class="section-title">Opciones de Construcción</h3>
                          
                          ${preciosOrdenados.map(precio => `
                              <div class="precio-card ${precio.opcion.recomendada ? 'premium' : ''}" style="border-color: ${precio.opcion.color};">
                                  <div class="precio-titulo" style="color: ${precio.opcion.color};">${precio.opcion.titulo}</div>
                                  <div class="precio-subtitulo">${precio.opcion.subtitulo}</div>
                                  <div class="precio-valor">
                                      <span class="precio-clp">${precio.clp.toLocaleString('es-CL')}</span>
                                      <div class="precio-uf">${precio.uf} UF</div>
                                      <span class="precio-iva">+ IVA</span>
                                  </div>
                                  <div style="font-weight: bold; color: ${precio.opcion.color}; margin-bottom: 8px; font-size: 14px; text-align: center;">
                                      Esta opción incluye:
                                  </div>
                                  <ul class="incluye-lista">
                                      ${precio.opcion.incluye.slice(0, 6).map(item => `<li>${item}</li>`).join('')}
                                      ${precio.opcion.incluye.length > 6 ? '<li style="font-style: italic; color: #666;">... y mucho más</li>' : ''}
                                  </ul>
                              </div>
                          `).join('')}
                      </div>
                      
                      <!-- AVISO IMPORTANTE -->
                      <div class="aviso importante">
                          <h4 style="margin-bottom: 10px;">Información Importante</h4>
                          <p style="margin: 5px 0; font-weight: 500;">
                              <strong>Estos precios son referenciales</strong> y están sujetos a evaluación final.
                          </p>
                          <p style="margin: 5px 0;">
                              <strong>Deben ser aprobados por un agente de ventas</strong> de Prefabricadas Premium.
                          </p>
                          <p style="margin: 5px 0; font-size: 13px; font-style: italic;">
                              Los precios finales pueden variar según especificaciones del terreno, ubicación y requerimientos del proyecto.
                          </p>
                      </div>
                      
                      <!-- INFORMACIÓN UF Y VIGENCIA -->
                      <div class="aviso">
                          <strong style="font-size: 16px;">Valor UF utilizado:</strong><br>
                          <span style="font-size: 18px; color: #8B5A3C; font-weight: bold;">${cotizacion.uf.valor.toLocaleString('es-CL')} pesos chilenos</span>
                          <br><small>Fecha: ${cotizacion.uf.fecha}</small>
                      </div>
                      
                      <div class="aviso vigencia">
                          <strong style="font-size: 16px;">Vigencia de la Cotización:</strong><br>
                          <span style="font-size: 18px; font-weight: bold;">Válida hasta el ${cotizacion.vigencia}</span><br>
                          <small>(15 días corridos desde la emisión)</small>
                      </div>
                      
                      <!-- FINANCIAMIENTO -->
                      ${cotizacion.financiamiento.solicitado ? `
                      <div class="financiamiento-info">
                          <h4 style="color: #155724; margin-bottom: 15px; text-align: center;">Financiamiento Solicitado</h4>
                          <div style="text-align: center;">
                              <p><strong>Monto:</strong> ${parseInt(cotizacion.financiamiento.monto || 0).toLocaleString('es-CL')} pesos chilenos</p>
                              <p><strong>Modalidad:</strong> Crédito hipotecario de autoconstrucción</p>
                              <p><strong>Financiamiento:</strong> Hasta 80% del valor con SALVUM</p>
                              <p style="margin-top: 10px; font-style: italic; color: #666; font-size: 13px;">
                                  Te asesoramos en la postulación a subsidios DS1, DS49 y DS19 sin costo.
                              </p>
                          </div>
                      </div>
                      ` : `
                      <div class="financiamiento-info">
                          <h4 style="color: #155724; margin-bottom: 15px; text-align: center;">Opciones de Financiamiento</h4>
                          <div style="text-align: center;">
                              <p><strong>SALVUM:</strong> Financia hasta en 60 cuotas</p>
                              <p><strong>Crédito Hipotecario:</strong> Hasta 80% del valor</p>
                              <p><strong>Subsidios:</strong> Te asesoramos en DS1, DS49 y DS19</p>
                              <p style="margin-top: 10px; font-style: italic; color: #666; font-size: 13px;">
                                  Consulta con tu agente sobre las mejores opciones de financiamiento.
                              </p>
                          </div>
                      </div>
                      `}
                      
                      <!-- OTRAS VARIANTES -->
                      <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border: 2px solid #28a745; padding: 20px; border-radius: 8px; margin: 15px 0; text-align: center;">
                          <h4 style="color: #155724; margin-bottom: 15px;">Más Opciones Disponibles</h4>
                          <div style="color: #155724;">
                              <p style="margin: 8px 0; font-weight: 500;">
                                  <strong>Múltiples variantes y tamaños</strong> para cada modelo
                              </p>
                              <p style="margin: 8px 0;">
                                  <strong>Diferentes metrajes y distribuciones</strong> según tus necesidades
                              </p>
                              <p style="margin: 8px 0;">
                                  <strong>Opciones personalizadas</strong> para tu presupuesto y terreno
                              </p>
                              <p style="margin: 15px 0 8px 0; font-style: italic; color: #666; font-size: 13px;">
                                  Pregunta a tu agente de ventas por todas las variantes disponibles.
                              </p>
                          </div>
                      </div>
                      
                      <!-- WHATSAPP -->
                      <div class="whatsapp-section">
                          <h3 style="margin-bottom: 10px;">¿Consultas sobre tu cotización?</h3>
                          <p>Conecta con nuestro especialista de ${cotizacion.sucursal.nombre}</p>
                          <a href="https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, consultas sobre cotización ${cotizacion.numero} modelo ${cotizacion.modelo.nombre}" 
                             class="whatsapp-btn" target="_blank">
                              Chatear por WhatsApp
                          </a>
                          <p style="margin-top: 10px; font-size: 14px; opacity: 0.9;">
                              ${cotizacion.sucursal.whatsapp} | Lunes a Viernes 9:00 a 18:00 horas
                          </p>
                      </div>
                      
                      <!-- PREGUNTAS FRECUENTES -->
                      <div class="section">
                          <h3 class="section-title">Preguntas Frecuentes</h3>
                          ${cotizacion.preguntas_frecuentes.map(categoria => `
                              <div class="faq-categoria">
                                  <h4>${categoria.categoria}</h4>
                                  ${categoria.preguntas.slice(0, 2).map(item => `
                                      <div class="faq-item">
                                          <div class="faq-pregunta">${item.pregunta}</div>
                                          <div class="faq-respuesta">${item.respuesta}</div>
                                      </div>
                                  `).join('')}
                              </div>
                          `).join('')}
                      </div>
                      
                      <!-- FOOTER -->
                      <div class="footer">
                          <h3>Prefabricadas Premium</h3>
                          <p>Tu casa soñada, construida con la más alta calidad</p>
                          <p>Email: ${cotizacion.sucursal.email} | Teléfono: ${cotizacion.sucursal.whatsapp}</p>
                          <p>Dirección: ${cotizacion.sucursal.direccion}</p>
                          <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #555; font-size: 12px;">
                              Cotización generada el ${cotizacion.fecha} | Válida 15 días | Precios más IVA
                          </div>
                      </div>
                      
                  </div>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;
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
    console.log('Precio Panel Madera + IVA:', cotizacion.precios.economica?.clp);
    console.log('Precio Panel SIP + IVA:', cotizacion.precios.premium?.clp);
    console.log('Precio Panel Metalcon + IVA:', cotizacion.precios.estructural?.clp);

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
Panel Madera + IVA: ${cotizacion.precios.economica?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.economica?.uf} UF) | 
Panel SIP + IVA: ${cotizacion.precios.premium?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.premium?.uf} UF) | 
Panel Metalcon + IVA: ${cotizacion.precios.estructural?.clp?.toLocaleString('es-CL')} (${cotizacion.precios.estructural?.uf} UF) | 
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

    // SENDGRID - Enviar email COMPLETO (si está configurado)
    if (SENDGRID_API_KEY) {
      try {
        console.log('=== ENVIANDO EMAIL COMPLETO MÓVIL-OPTIMIZADO ===');
        
        const emailPayload = {
          personalizations: [{
            to: [{ email: datos.correo, name: datos.nombre }]
          }],
          from: { 
            email: 'cotizacion@prefabricadaspremium.cl', 
            name: `Prefabricadas Premium - ${cotizacion.sucursal.nombre}` 
          },
          subject: `Cotización ${cotizacion.numero} - Modelo ${datos.modelo} con Planta PDF`,
          content: [{
            type: 'text/html',
            value: generarHTMLEmailCompleto(cotizacion)
          }],
          headers: {
            'Content-Language': 'es',
            'Accept-Language': 'es'
          }
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
          console.log('✅ Email completo enviado exitosamente');
          emailResult = { success: true, message: 'Email completo enviado con planta PDF' };
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