// Sistema de Cotización Completo v3.1 - Prefabricadas Premium
class SistemaCotizacionCompleto {
  constructor() {
    this.valorUF = null;
    this.fechaUF = null;
    
    // Configuración de sucursales con WhatsApp
    this.sucursales = {
      'La Serena': {
        whatsapp: '+56955278508',
        nombre: 'La Serena',
        direccion: 'Av. Francisco de Aguirre 123, La Serena',
        email: 'lsanchez@prefabricadaspremium.cl'
      },
      'Casablanca': {
        whatsapp: '+56938886338',
        nombre: 'Casablanca',
        direccion: 'Ruta 68 Km 75, Casablanca',
        email: 'cmorales@prefabricadaspremium.cl'
      },
      'Copiapó': {
        whatsapp: '+56950573020',
        nombre: 'Copiapó',
        direccion: 'Av. Copayapu 456, Copiapó',
        email: 'ffabrega@prefabricadaspremium.cl'
      }
    };

    // Configuración HubSpot
    this.hubspot = {
      apiKey: null, // Se configurará después
      portalId: null,
      apiUrl: 'https://api.hubapi.com'
    };

    // Tarifas por m2 en UF (sin IVA - se aplicará después)
    this.tarifas = {
      MADERA_TINGLADO: { util: 3.6, terraza: 2, entrepiso: null, logia: 2.7 },
      MADERA_OSB: { util: 3.6, terraza: 2, entrepiso: 0.72, logia: 2.7 },
      MADERA_VOLCANBOARD: { util: 4.1, terraza: 2, entrepiso: 0.72, logia: 3 },
      SIP_VOLCANBOARD: { util: 4.6, terraza: 2, entrepiso: 0.72, logia: 3 },
      SIP_OSB: { util: 3.6, terraza: 2, entrepiso: 0.72, logia: 3 },
      METALCON_VOLCANBOARD: { util: 4.6, terraza: 2, entrepiso: 1.72, logia: 3 },
      METALCON_OSB: { util: 4.1, terraza: 2, entrepiso: 1.72, logia: 3 }
    };

    // Modelos con todas sus variantes CORREGIDO - Milán incluye SIP + VOLCANBOARD
    this.modelos = {
      'Milán': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 },
          { material: 'MADERA', revestimiento: 'VOLCANBOARD', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 }
        ],
        imagen: 'modelos/milan.jpg',
        dormitorios: 5,
        baños: 4
      },
      'Marbella': {
        opciones: [
          { material: 'MADERA', revestimiento: 'TINGLADO', m2_utiles: 125, m2_terraza: 50, entrepiso: 0, logia: 0 },
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 139, m2_terraza: 50, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 141, m2_terraza: 50, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 139, m2_terraza: 50, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/marbella.jpg',
        dormitorios: 4,
        baños: 2
      },
      'Praga': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 180, m2_terraza: 18, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 180, m2_terraza: 18, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 180, m2_terraza: 18, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/praga.jpg',
        dormitorios: 4,
        baños: 3
      },
      'Barcelona': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 150, m2_terraza: 9, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 150, m2_terraza: 9, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 150, m2_terraza: 9, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/barcelona.jpg',
        dormitorios: 3,
        baños: 2
      },
      'Capri': {
        opciones: [
          { material: 'MADERA', revestimiento: 'TINGLADO', m2_utiles: 83, m2_terraza: 41, entrepiso: 0, logia: 0 },
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 92, m2_terraza: 36, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 92, m2_terraza: 36, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 92, m2_terraza: 36, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/capri.jpg',
        dormitorios: 3,
        baños: 2
      },
      'Toscana': {
        opciones: [
          { material: 'MADERA', revestimiento: 'TINGLADO', m2_utiles: 72, m2_terraza: 0, entrepiso: 0, logia: 0 },
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 87, m2_terraza: 0, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 87, m2_terraza: 0, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 87, m2_terraza: 0, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/toscana.jpg',
        dormitorios: 3,
        baños: 2
      },
      'Amalfitano': {
        opciones: [
          { material: 'MADERA', revestimiento: 'TINGLADO', m2_utiles: 194, m2_terraza: 72, entrepiso: 0, logia: 0 },
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 230, m2_terraza: 71, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 230, m2_terraza: 71, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 230, m2_terraza: 71, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/amalfitano.jpg',
        dormitorios: 4,
        baños: 3
      },
      'Málaga': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 120, m2_terraza: 25, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 120, m2_terraza: 25, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 120, m2_terraza: 25, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/malaga.jpg',
        dormitorios: 3,
        baños: 2
      },
      'Mónaco': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 115, m2_terraza: 30, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 115, m2_terraza: 30, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 115, m2_terraza: 30, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/monaco.jpg',
        dormitorios: 3,
        baños: 2
      },
      'Cádiz': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 105, m2_terraza: 20, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 105, m2_terraza: 20, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 105, m2_terraza: 20, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/cadiz.jpg',
        dormitorios: 3,
        baños: 2
      },
      'Eclipse': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 98, m2_terraza: 22, entrepiso: 0, logia: 0 },
          { material: 'SIP', revestimiento: 'VOLCANBOARD', m2_utiles: 98, m2_terraza: 22, entrepiso: 0, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 98, m2_terraza: 22, entrepiso: 0, logia: 0 }
        ],
        imagen: 'modelos/eclipse.jpg',
        dormitorios: 3,
        baños: 2
      }
    };

    // Tres opciones principales para mostrar al cliente
    this.opcionesRecomendadas = {
      economica: {
        titulo: 'Opción Económica',
        subtitulo: 'Madera + OSB',
        descripcion: 'Excelente relación calidad-precio para tu primera casa',
        material: 'MADERA',
        revestimiento: 'OSB',
        color: '#6c757d',
        orden: 1,
        incluye: [
          'Estructura de madera certificada FSC',
          'Revestimiento OSB resistente a la humedad',
          'Aislación térmica según normativa chilena',
          'Instalación eléctrica básica empotrada',
          'Instalación sanitaria completa',
          'Terminaciones interiores estándar',
          'Puertas y ventanas con vidrio termopanel',
          'Cubierta con teja asfáltica 25 años',
          'Pintura exterior e interior incluida',
          'Garantía estructural 10 años'
        ]
      },
      premium: {
        titulo: 'Opción Premium',
        subtitulo: 'SIP + Volcanboard',
        descripcion: 'Máxima eficiencia energética y confort térmico',
        material: 'SIP',
        revestimiento: 'VOLCANBOARD',
        color: '#28a745',
        orden: 2,
        recomendada: true,
        incluye: [
          'Paneles SIP (Structural Insulated Panels)',
          'Volcanboard 8mm fibrocemento ambas caras',
          'Refuerzo estructural en núcleo de espuma',
          'Aislación térmica premium R-15',
          'Instalación eléctrica completa empotrada',
          'Instalación sanitaria de lujo',
          'Terminaciones interiores premium',
          'Puertas y ventanas de calidad superior',
          'Cubierta reforzada con garantía extendida',
          'Pintura exterior premium 15 años garantía',
          'Pre-instalación para climatización',
          'Garantía estructural 15 años'
        ]
      },
      estructural: {
        titulo: 'Opción Estructural',
        subtitulo: 'Metalcon + Volcanboard',
        descripcion: 'Máxima resistencia sísmica y durabilidad',
        material: 'METALCON',
        revestimiento: 'VOLCANBOARD',
        color: '#0074D9',
        orden: 3,
        incluye: [
          'Estructura Steel Frame galvanizada',
          'Volcanboard estructural 8mm',
          'Sistema antisísmico reforzado NCh433',
          'Aislación térmica y acústica superior',
          'Instalación eléctrica industrial empotrada',
          'Instalación sanitaria premium',
          'Terminaciones resistentes al fuego',
          'Puertas y ventanas grado comercial',
          'Cubierta metálica garantía 25 años',
          'Tratamiento anticorrosivo total',
          'Certificación resistencia fuego F60',
          'Garantía estructural 20 años'
        ]
      }
    };

    // Preguntas frecuentes (desde la investigación)
    this.preguntasFrecuentes = [
      {
        categoria: 'Construcción y Calidad',
        preguntas: [
          {
            pregunta: '¿Cuánto tiempo demora la construcción?',
            respuesta: 'La fabricación toma 6-8 semanas en condiciones controladas de fábrica, más 1-2 semanas de montaje en sitio. Total: 2-3 meses versus 6-12 meses de construcción tradicional.'
          },
          {
            pregunta: '¿Qué resistencia sísmica tienen las casas?',
            respuesta: 'Todas nuestras casas cumplen con la norma NCh433 y están diseñadas para resistir terremotos de magnitud 9+. Los sistemas de acero tienen especial flexibilidad estructural para zonas sísmicas.'
          },
          {
            pregunta: '¿Cuál es la vida útil de una casa prefabricada?',
            respuesta: 'Con mantenimiento adecuado: Madera 50-100 años, Acero 100+ años, SIP 75+ años. Todas incluyen garantía estructural de 10-20 años según la opción.'
          }
        ]
      },
      {
        categoria: 'Permisos y Proceso',
        preguntas: [
          {
            pregunta: '¿Se encargan de los permisos municipales?',
            respuesta: 'Sí, gestionamos todos los permisos DOM requeridos. El proceso toma 30-60 días según la comuna. Incluimos arquitecto, cálculo estructural y tramitación completa.'
          },
          {
            pregunta: '¿Qué incluye el servicio "llave en mano"?',
            respuesta: 'Incluye: diseño, permisos, fabricación, preparación del terreno, fundaciones, montaje, instalaciones completas, terminaciones y recepción final. Solo necesitas las llaves.'
          },
          {
            pregunta: '¿Qué requisitos tiene mi terreno?',
            respuesta: 'Debe ser edificable, nivelado, con acceso para camiones (6m ancho mínimo), y conexiones de servicios básicos disponibles. Realizamos evaluación gratuita del terreno.'
          }
        ]
      },
      {
        categoria: 'Financiamiento',
        preguntas: [
          {
            pregunta: '¿Puedo financiar mi casa prefabricada?',
            respuesta: 'Sí, trabajamos con todos los bancos principales y ofrecemos crédito hipotecario de autoconstrucción hasta 80% del valor. También aplicamos subsidios DS1 y DS49.'
          },
          {
            pregunta: '¿Qué subsidios puedo usar?',
            respuesta: 'DS1 (250-550 UF), DS49 Fondo Solidario (hasta 950 UF), DS19 para clase media (1,100-2,400 UF). Te asesoramos en la postulación sin costo.'
          }
        ]
      },
      {
        categoria: 'Eficiencia y Mantención',
        preguntas: [
          {
            pregunta: '¿Son más eficientes energéticamente?',
            respuesta: 'Sí, hasta 60% más eficientes que construcción tradicional, con 25% de ahorro en calefacción. Cumplimos con las 9 zonas térmicas de Chile.'
          },
          {
            pregunta: '¿Qué mantenimiento requieren?',
            respuesta: 'Mantenimiento mínimo: revisión anual, pintura exterior cada 5-7 años, limpieza de canaletas. 7-10% menos mantenimiento que construcción tradicional.'
          }
        ]
      }
    ];

    this.init();
  }

  async init() {
    await this.obtenerValorUF();
  }

  // Obtener valor actual de la UF
  async obtenerValorUF() {
    try {
      const response = await fetch('https://api.boostr.cl/economy/indicator/uf.json');
      const data = await response.json();
      
      if (data && data.value) {
        this.valorUF = parseFloat(data.value);
        this.fechaUF = new Date().toLocaleDateString('es-CL');
        console.log(`UF obtenida: $${this.valorUF.toLocaleString('es-CL')} (${this.fechaUF})`);
        return true;
      }
    } catch (error) {
      console.error('Error al obtener UF:', error);
      this.valorUF = 37500; // Valor de respaldo
      this.fechaUF = new Date().toLocaleDateString('es-CL');
    }
    return false;
  }

  // Calcular precios para un modelo específico
  calcularPrecios(nombreModelo) {
    const modelo = this.modelos[nombreModelo];
    if (!modelo) return null;

    const precios = {};

    // Calcular para cada opción recomendada
    Object.keys(this.opcionesRecomendadas).forEach(tipoOpcion => {
      const opcion = this.opcionesRecomendadas[tipoOpcion];
      
      // Buscar la configuración del modelo que coincida
      const configuracion = modelo.opciones.find(opt => 
        opt.material === opcion.material && opt.revestimiento === opcion.revestimiento
      );

      if (configuracion) {
        const tarifa = this.tarifas[`${opcion.material}_${opcion.revestimiento}`];
        
        let totalUF = 0;
        let desglose = {};

        // Calcular cada tipo de área
        if (configuracion.m2_utiles) {
          const precioUtiles = configuracion.m2_utiles * tarifa.util;
          totalUF += precioUtiles;
          desglose.utiles = { m2: configuracion.m2_utiles, precio_m2: tarifa.util, total: precioUtiles };
        }

        if (configuracion.m2_terraza) {
          const precioTerraza = configuracion.m2_terraza * tarifa.terraza;
          totalUF += precioTerraza;
          desglose.terraza = { m2: configuracion.m2_terraza, precio_m2: tarifa.terraza, total: precioTerraza };
        }

        if (configuracion.entrepiso && tarifa.entrepiso) {
          const precioEntrepiso = configuracion.entrepiso * tarifa.entrepiso;
          totalUF += precioEntrepiso;
          desglose.entrepiso = { m2: configuracion.entrepiso, precio_m2: tarifa.entrepiso, total: precioEntrepiso };
        }

        if (configuracion.logia && tarifa.logia) {
          const precioLogia = configuracion.logia * tarifa.logia;
          totalUF += precioLogia;
          desglose.logia = { m2: configuracion.logia, precio_m2: tarifa.logia, total: precioLogia };
        }

        precios[tipoOpcion] = {
          uf: Math.round(totalUF * 100) / 100,
          clp: Math.round(totalUF * this.valorUF * 1.19), // CORREGIDO: Agregado IVA 19%
          desglose: desglose,
          configuracion: configuracion,
          opcion: opcion
        };
      }
    });

    return precios;
  }

  // Generar cotización completa
  generarCotizacion(datosFormulario) {
    const precios = this.calcularPrecios(datosFormulario.modelo);
    if (!precios) return null;

    const modeloInfo = this.modelos[datosFormulario.modelo];
    const numeroCotizacion = this.generarNumeroCotizacion();
    const fechaCotizacion = new Date().toLocaleDateString('es-CL');
    const vigencia = this.calcularVigencia();

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
        imagen: modeloInfo.imagen
      },
      
      precios: precios,
      
      uf: {
        valor: this.valorUF,
        fecha: this.fechaUF
      },
      
      sucursal: this.sucursales[datosFormulario.sucursal] || this.sucursales['La Serena'],
      
      financiamiento: {
        solicitado: datosFormulario.financia === 'si',
        monto: datosFormulario.monto || null,
        rut_financiamiento: datosFormulario.rut || null
      },
      
      preguntas_frecuentes: this.preguntasFrecuentes
    };
  }

  // Generar número de cotización único
  generarNumeroCotizacion() {
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2);
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PP-${year}${month}${day}-${random}`;
  }

  // Calcular vigencia (15 días corridos)
  calcularVigencia() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 15);
    return fecha.toLocaleDateString('es-CL');
  }

  // Generar HTML profesional para cotización (para email)
  generarHTMLCotizacion(cotizacion) {
    const preciosOrdenados = ['economica', 'premium', 'estructural'].map(tipo => ({
      tipo,
      ...cotizacion.precios[tipo]
    })).filter(precio => precio.uf); // Solo mostrar precios que existan

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cotización ${cotizacion.numero} - Prefabricadas Premium</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background: #f5f5f5; 
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 15px; 
                overflow: hidden; 
                box-shadow: 0 15px 40px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #8B5A3C 0%, #A67C52 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }
            .header h1 { 
                font-size: 2.2em; 
                margin-bottom: 10px; 
                font-weight: 300; 
            }
            .header p { 
                font-size: 1.1em; 
                opacity: 0.9; 
            }
            
            .cliente-info { 
                background: #f8f9fa; 
                padding: 30px; 
                border-bottom: 1px solid #e9ecef; 
            }
            .info-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 15px; 
                margin-top: 15px; 
            }
            .info-item { 
                background: white; 
                padding: 15px; 
                border-radius: 8px; 
                border-left: 4px solid #8B5A3C; 
            }
            .info-item strong { 
                display: block; 
                color: #8B5A3C; 
                font-size: 0.9em; 
                margin-bottom: 5px; 
            }
            
            .modelo-section { 
                padding: 30px; 
                text-align: center;
            }
            .modelo-section h2 { 
                color: #8B5A3C; 
                font-size: 2em; 
                margin-bottom: 15px; 
            }
            .modelo-detalles { 
                display: inline-flex; 
                gap: 15px; 
                margin-bottom: 20px; 
            }
            .detalle { 
                background: #D4B896; 
                padding: 8px 16px; 
                border-radius: 20px; 
                font-weight: 600; 
                color: #8B5A3C; 
            }
            
            .precios-section { 
                padding: 30px; 
                background: #f8f9fa; 
            }
            .precios-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                gap: 20px; 
            }
            .precio-card { 
                background: white; 
                border-radius: 12px; 
                padding: 25px; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.08); 
                border: 3px solid transparent; 
                position: relative;
            }
            .precio-card.recomendada { 
                border-color: #28a745; 
                transform: scale(1.02);
            }
            .precio-card.recomendada::before { 
                content: 'MÁS POPULAR'; 
                position: absolute; 
                top: -12px; 
                right: 15px; 
                background: #28a745; 
                color: white; 
                padding: 6px 15px; 
                border-radius: 20px; 
                font-size: 0.7em; 
                font-weight: bold; 
            }
            .precio-titulo { 
                font-size: 1.3em; 
                font-weight: bold; 
                margin-bottom: 5px; 
                text-align: center; 
            }
            .precio-subtitulo { 
                font-size: 0.9em; 
                opacity: 0.7; 
                text-align: center; 
                margin-bottom: 20px; 
            }
            .precio-valor { 
                text-align: center; 
                margin: 20px 0; 
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .precio-clp { 
                font-size: 1.8em; 
                font-weight: bold; 
                color: #8B5A3C; 
                display: block; 
            }
            .precio-uf { 
                font-size: 1em; 
                color: #666; 
                margin-top: 5px; 
            }
            .incluye-lista { 
                list-style: none; 
                padding: 0; 
                margin-top: 15px;
            }
            .incluye-lista li { 
                padding: 6px 0; 
                position: relative; 
                padding-left: 20px; 
                font-size: 0.9em;
                border-bottom: 1px solid #eee;
            }
            .incluye-lista li::before { 
                content: '✓'; 
                position: absolute; 
                left: 0; 
                color: #28a745; 
                font-weight: bold; 
            }
            .incluye-lista li:last-child { border-bottom: none; }
            
            .uf-info, .vigencia { 
                background: #fff3cd; 
                border: 2px solid #ffeaa7; 
                padding: 20px; 
                border-radius: 10px; 
                margin: 20px 30px; 
                text-align: center; 
            }
            .vigencia { 
                background: #d1ecf1; 
                border-color: #bee5eb; 
                color: #0c5460; 
            }
            
            .whatsapp-section {
                background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
                color: white;
                padding: 25px 30px;
                text-align: center;
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
                font-size: 1em;
            }
            
            .faq-section { 
                background: white; 
                padding: 30px; 
            }
            .faq-title { 
                color: #8B5A3C; 
                font-size: 1.8em; 
                margin-bottom: 25px; 
                text-align: center; 
            }
            .faq-categoria {
                margin-bottom: 25px;
            }
            .faq-categoria h4 {
                color: #28a745;
                font-size: 1.2em;
                margin-bottom: 12px;
                padding-bottom: 6px;
                border-bottom: 2px solid #28a745;
            }
            .faq-item { 
                margin-bottom: 15px; 
                padding-bottom: 12px; 
                border-bottom: 1px solid #eee; 
            }
            .faq-item:last-child { 
                border-bottom: none; 
                padding-bottom: 0; 
            }
            .faq-pregunta { 
                font-weight: bold; 
                color: #8B5A3C; 
                margin-bottom: 6px; 
                font-size: 0.95em; 
            }
            .faq-respuesta { 
                color: #555; 
                line-height: 1.5; 
                font-size: 0.9em;
            }
            
            .footer { 
                background: #333; 
                color: white; 
                padding: 30px; 
                text-align: center; 
            }
            .footer h3 { 
                margin-bottom: 15px; 
                font-size: 1.6em;
            }
            .footer p { 
                margin: 6px 0; 
                opacity: 0.9; 
                font-size: 0.95em;
            }
            
            @media (max-width: 600px) {
                .container { margin: 0; border-radius: 0; }
                .precios-grid { grid-template-columns: 1fr; }
                .info-grid { grid-template-columns: 1fr; }
                .header { padding: 25px 20px; }
                .header h1 { font-size: 1.8em; }
                .precio-clp { font-size: 1.5em; }
                .modelo-detalles { flex-direction: column; gap: 8px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏠 COTIZACIÓN PREFABRICADAS PREMIUM</h1>
                <p>Cotización N° ${cotizacion.numero} | ${cotizacion.fecha}</p>
            </div>
            
            <div class="cliente-info">
                <h3 style="color: #8B5A3C; margin-bottom: 15px;">📋 Información del Cliente</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Nombre</strong>
                        ${cotizacion.cliente.nombre}
                    </div>
                    <div class="info-item">
                        <strong>Email</strong>
                        ${cotizacion.cliente.email}
                    </div>
                    <div class="info-item">
                        <strong>Teléfono</strong>
                        ${cotizacion.cliente.telefono}
                    </div>
                    <div class="info-item">
                        <strong>Sucursal</strong>
                        ${cotizacion.sucursal.nombre}
                    </div>
                </div>
            </div>
            
            <div class="modelo-section">
                <h2>Modelo ${cotizacion.modelo.nombre}</h2>
                <div class="modelo-detalles">
                    <span class="detalle">${cotizacion.modelo.dormitorios} Dormitorios</span>
                    <span class="detalle">${cotizacion.modelo.baños} Baños</span>
                </div>
                <p style="color: #666; font-size: 1em; max-width: 600px; margin: 0 auto;">
                    Casa diseñada con los más altos estándares de calidad y eficiencia energética, 
                    cumpliendo con todas las normativas chilenas de construcción y resistencia sísmica.
                </p>
            </div>
            
            <div class="precios-section">
                <h3 style="color: #8B5A3C; margin-bottom: 25px; text-align: center; font-size: 1.8em;">💰 Opciones de Construcción</h3>
                <div class="precios-grid">
                    ${preciosOrdenados.map(precio => `
                        <div class="precio-card ${precio.opcion.recomendada ? 'recomendada' : ''}" style="border-color: ${precio.opcion.color};">
                            <div class="precio-titulo" style="color: ${precio.opcion.color};">${precio.opcion.titulo}</div>
                            <div class="precio-subtitulo">${precio.opcion.subtitulo}</div>
                            <div class="precio-valor">
                                <span class="precio-clp">$${precio.clp.toLocaleString('es-CL')}</span>
                                <div class="precio-uf">${precio.uf} UF (IVA incluido)</div>
                            </div>
                            <div style="font-weight: bold; color: ${precio.opcion.color}; margin-bottom: 10px; font-size: 1em;">
                                ✨ Esta opción incluye:
                            </div>
                            <ul class="incluye-lista">
                                ${precio.opcion.incluye.slice(0, 6).map(item => `<li>${item}</li>`).join('')}
                                ${precio.opcion.incluye.length > 6 ? '<li style="font-style: italic; color: #666;">... y mucho más</li>' : ''}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="uf-info">
                <strong style="font-size: 1.1em;">📊 Valor UF utilizado:</strong><br>
                <span style="font-size: 1.3em; color: #8B5A3C; font-weight: bold;">$${cotizacion.uf.valor.toLocaleString('es-CL')}</span>
                <br><small>Fecha: ${cotizacion.uf.fecha}</small>
            </div>
            
            <div class="vigencia">
                <strong style="font-size: 1.1em;">⏰ Vigencia:</strong><br>
                <span style="font-size: 1.2em;">Válida hasta el ${cotizacion.vigencia}</span><br>
                <small>(15 días corridos desde la emisión)</small>
            </div>
            
            ${cotizacion.financiamiento.solicitado ? `
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 25px 30px; margin: 20px 30px; border-radius: 12px;">
                <h3 style="color: #155724; margin-bottom: 15px; text-align: center;">💳 Financiamiento Solicitado</h3>
                <div style="text-align: center;">
                    <p><strong>Monto:</strong> $${parseInt(cotizacion.financiamiento.monto || 0).toLocaleString('es-CL')}</p>
                    <p><strong>Modalidad:</strong> Crédito hipotecario de autoconstrucción</p>
                    <p><strong>Financiamiento:</strong> Hasta 80% del valor</p>
                    <p style="margin-top: 10px; font-style: italic; color: #666; font-size: 0.9em;">
                        Te asesoramos en la postulación a subsidios DS1, DS49 y DS19 sin costo.
                    </p>
                </div>
            </div>
            ` : ''}
            
            <div class="whatsapp-section">
                <h3 style="margin-bottom: 10px;">💬 ¿Consultas sobre tu cotización?</h3>
                <p>Conecta con nuestro especialista de ${cotizacion.sucursal.nombre}</p>
                <a href="https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, consultas sobre cotización ${cotizacion.numero} modelo ${cotizacion.modelo.nombre}" 
                   class="whatsapp-btn" target="_blank">
                    📱 Chatear por WhatsApp
                </a>
                <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.9;">
                    ${cotizacion.sucursal.whatsapp} | Lun-Vie 9:00-18:00
                </p>
            </div>
            
            <div class="faq-section">
                <h3 class="faq-title">❓ Preguntas Frecuentes</h3>
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
            
            <div class="footer">
                <h3>Prefabricadas Premium</h3>
                <p>Tu casa soñada, construida con la más alta calidad</p>
                <p>📧 ${cotizacion.sucursal.email} | 📱 ${cotizacion.sucursal.whatsapp}</p>
                <p>📍 ${cotizacion.sucursal.direccion}</p>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #555; font-size: 0.85em;">
                    Cotización generada el ${cotizacion.fecha} | Válida 15 días | Precios incluyen IVA
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Configurar HubSpot API
  configurarHubSpot(apiKey, portalId) {
    this.hubspot.apiKey = apiKey;
    this.hubspot.portalId = portalId;
  }

  // Enviar contacto a HubSpot
  async enviarContactoHubSpot(cotizacion) {
    if (!this.hubspot.apiKey) {
      console.warn('HubSpot no configurado');
      return { success: false, error: 'HubSpot no configurado' };
    }

    try {
      const contactData = {
        properties: {
          email: cotizacion.cliente.email,
          firstname: cotizacion.cliente.nombre.split(' ')[0],
          lastname: cotizacion.cliente.nombre.split(' ').slice(1).join(' '),
          phone: cotizacion.cliente.telefono,
          rut_cliente: cotizacion.cliente.rut,
          modelo_interes: cotizacion.modelo.nombre,
          precio_economico: cotizacion.precios.economica?.clp || 0,
          precio_premium: cotizacion.precios.premium?.clp || 0,
          precio_estructural: cotizacion.precios.estructural?.clp || 0,
          sucursal_preferida: cotizacion.sucursal.nombre,
          numero_cotizacion: cotizacion.numero,
          fecha_cotizacion: cotizacion.fecha,
          financiamiento_solicitado: cotizacion.financiamiento.solicitado,
          monto_financiamiento: cotizacion.financiamiento.monto,
          habitaciones_necesarias: cotizacion.cliente.habitaciones_necesarias,
          comentarios_cliente: cotizacion.cliente.comentarios,
          valor_uf_cotizacion: cotizacion.uf.valor,
          vigencia_cotizacion: cotizacion.vigencia,
          lead_source: 'Formulario Cotización Web',
          lifecycle_stage: 'lead'
        }
      };

      const response = await fetch(`${this.hubspot.apiUrl}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hubspot.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, contactId: result.id };
      } else {
        const error = await response.text();
        return { success: false, error: error };
      }

    } catch (error) {
      console.error('Error enviando a HubSpot:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = { SistemaCotizacionCompleto };