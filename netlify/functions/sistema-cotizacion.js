// Sistema de Cotización Completo v3.0 - Prefabricadas Premium
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
        email: 'laserena@prefabricadaspremium.cl'
      },
      'Casablanca': {
        whatsapp: '+56938886338',
        nombre: 'Casablanca',
        direccion: 'Ruta 68 Km 75, Casablanca',
        email: 'casablanca@prefabricadaspremium.cl'
      },
      'Copiapó': {
        whatsapp: '+56950573020',
        nombre: 'Copiapó',
        direccion: 'Av. Copayapu 456, Copiapó',
        email: 'copiapo@prefabricadaspremium.cl'
      }
    };

    // Configuración HubSpot
    this.hubspot = {
      apiKey: null, // Se configurará después
      portalId: null,
      apiUrl: 'https://api.hubapi.com'
    };

    // Tarifas por m2 en UF + IVA
    this.tarifas = {
      MADERA_TINGLADO: { util: 3.6, terraza: 2, entrepiso: null, logia: 2.7 },
      MADERA_OSB: { util: 3.6, terraza: 2, entrepiso: 0.72, logia: 2.7 },
      MADERA_VOLCANBOARD: { util: 4.1, terraza: 2, entrepiso: 0.72, logia: 3 },
      SIP_VOLCANBOARD: { util: 4.6, terraza: 2, entrepiso: 0.72, logia: 3 },
      SIP_OSB: { util: 3.6, terraza: 2, entrepiso: 0.72, logia: 3 },
      METALCON_VOLCANBOARD: { util: 4.6, terraza: 2, entrepiso: 1.72, logia: 3 },
      METALCON_OSB: { util: 4.1, terraza: 2, entrepiso: 1.72, logia: 3 }
    };

    // Modelos con todas sus variantes
    this.modelos = {
      'Milán': {
        opciones: [
          { material: 'MADERA', revestimiento: 'OSB', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 },
          { material: 'MADERA', revestimiento: 'VOLCANBOARD', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 },
          { material: 'METALCON', revestimiento: 'VOLCANBOARD', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 },
          { material: 'METALCON', revestimiento: 'OSB', m2_utiles: 230, m2_terraza: 81, entrepiso: 84, logia: 0 }
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
          clp: Math.round(totalUF * this.valorUF),
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
        solicitado: datosFormulario.financia === 'Sí',
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

  // Generar HTML profesional para cotización
  generarHTMLCotizacion(cotizacion) {
    const preciosOrdenados = ['economica', 'premium', 'estructural'].map(tipo => ({
      tipo,
      ...cotizacion.precios[tipo]
    }));

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
                max-width: 1000px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 15px; 
                overflow: hidden; 
                box-shadow: 0 15px 40px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #0074D9 0%, #0056b3 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="2" fill="white" opacity="0.1"/></svg>');
            }
            .logo { 
                max-height: 80px; 
                margin-bottom: 20px; 
                position: relative; 
                z-index: 1;
            }
            .header h1 { 
                font-size: 2.5em; 
                margin-bottom: 10px; 
                font-weight: 300; 
                position: relative; 
                z-index: 1;
            }
            .header p { 
                font-size: 1.2em; 
                opacity: 0.9; 
                position: relative; 
                z-index: 1;
            }
            
            .cliente-info { 
                background: #f8f9fa; 
                padding: 30px; 
                border-bottom: 1px solid #e9ecef; 
            }
            .cliente-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                gap: 20px; 
                margin-top: 20px; 
            }
            .cliente-item { 
                background: white; 
                padding: 20px; 
                border-radius: 10px; 
                border-left: 4px solid #0074D9; 
                box-shadow: 0 3px 10px rgba(0,0,0,0.05); 
            }
            .cliente-item strong { 
                display: block; 
                color: #0074D9; 
                font-size: 0.9em; 
                text-transform: uppercase; 
                letter-spacing: 0.5px; 
                margin-bottom: 8px; 
            }
            .cliente-item span { 
                font-size: 1.1em; 
                font-weight: 500; 
            }
            
            .modelo-section { 
                padding: 40px 30px; 
                background: white; 
            }
            .modelo-header { 
                display: grid; 
                grid-template-columns: 250px 1fr; 
                gap: 30px; 
                align-items: center; 
                margin-bottom: 30px; 
            }
            .modelo-imagen { 
                width: 100%; 
                height: 180px; 
                object-fit: cover; 
                border-radius: 12px; 
                box-shadow: 0 6px 20px rgba(0,0,0,0.1); 
            }
            .modelo-info h2 { 
                color: #0074D9; 
                font-size: 2.5em; 
                margin-bottom: 15px; 
            }
            .modelo-detalles { 
                display: flex; 
                gap: 20px; 
                margin-bottom: 15px; 
                flex-wrap: wrap;
            }
            .detalle { 
                background: #e8f4f8; 
                padding: 10px 20px; 
                border-radius: 25px; 
                font-weight: 600; 
                color: #0074D9; 
                font-size: 0.95em;
            }
            
            .precios-section { 
                padding: 40px 30px; 
                background: #f8f9fa; 
            }
            .precios-container { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
                gap: 25px; 
            }
            .precio-opcion { 
                background: white; 
                border-radius: 15px; 
                padding: 30px; 
                box-shadow: 0 8px 25px rgba(0,0,0,0.08); 
                border: 3px solid transparent; 
                transition: all 0.3s ease; 
                position: relative;
            }
            .precio-opcion.recomendada { 
                border-color: #28a745; 
                transform: scale(1.02);
            }
            .precio-opcion.recomendada::before { 
                content: 'MÁS POPULAR'; 
                position: absolute; 
                top: -15px; 
                right: 20px; 
                background: #28a745; 
                color: white; 
                padding: 8px 20px; 
                border-radius: 25px; 
                font-size: 0.75em; 
                font-weight: bold; 
                letter-spacing: 1px;
            }
            .precio-titulo { 
                font-size: 1.4em; 
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
            .precio-principal { 
                text-align: center; 
                margin: 25px 0; 
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            .precio-clp { 
                font-size: 2.2em; 
                font-weight: bold; 
                color: #0074D9; 
                display: block; 
            }
            .precio-uf { 
                font-size: 1.1em; 
                color: #666; 
                margin-top: 8px; 
            }
            .precio-desglose { 
                background: #f1f3f4; 
                padding: 15px; 
                border-radius: 8px; 
                margin: 20px 0; 
                font-size: 0.9em; 
            }
            .incluye-titulo {
                font-weight: bold;
                color: #0074D9;
                margin-bottom: 15px;
                font-size: 1.1em;
            }
            .incluye-lista { 
                list-style: none; 
                padding: 0; 
            }
            .incluye-lista li { 
                padding: 8px 0; 
                border-bottom: 1px solid #eee; 
                position: relative; 
                padding-left: 25px; 
                font-size: 0.9em;
            }
            .incluye-lista li::before { 
                content: '✓'; 
                position: absolute; 
                left: 0; 
                color: #28a745; 
                font-weight: bold; 
                font-size: 1.1em;
            }
            .incluye-lista li:last-child { border-bottom: none; }
            
            .uf-info { 
                background: #fff3cd; 
                border: 2px solid #ffeaa7; 
                padding: 25px; 
                border-radius: 12px; 
                margin: 30px; 
                text-align: center; 
            }
            .vigencia { 
                background: #d1ecf1; 
                border: 2px solid #bee5eb; 
                padding: 25px; 
                border-radius: 12px; 
                margin: 30px; 
                text-align: center; 
                color: #0c5460; 
            }
            
            .whatsapp-section {
                background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
                color: white;
                padding: 30px;
                margin: 30px;
                border-radius: 15px;
                text-align: center;
            }
            .whatsapp-btn {
                display: inline-block;
                background: white;
                color: #25D366;
                padding: 15px 30px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: bold;
                margin-top: 15px;
                font-size: 1.1em;
                transition: transform 0.3s ease;
            }
            .whatsapp-btn:hover {
                transform: scale(1.05);
            }
            
            .faq-section { 
                background: white; 
                padding: 40px 30px; 
            }
            .faq-title { 
                color: #0074D9; 
                font-size: 2em; 
                margin-bottom: 30px; 
                text-align: center; 
            }
            .faq-categoria {
                margin-bottom: 30px;
            }
            .faq-categoria h4 {
                color: #28a745;
                font-size: 1.3em;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #28a745;
            }
            .faq-item { 
                margin-bottom: 20px; 
                border-bottom: 1px solid #eee; 
                padding-bottom: 15px; 
            }
            .faq-item:last-child { 
                border-bottom: none; 
                padding-bottom: 0; 
            }
            .faq-pregunta { 
                font-weight: bold; 
                color: #0074D9; 
                margin-bottom: 8px; 
                font-size: 1em; 
            }
            .faq-respuesta { 
                color: #555; 
                line-height: 1.6; 
                font-size: 0.95em;
            }
            
            .footer { 
                background: #333; 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }
            .footer h3 { 
                margin-bottom: 20px; 
                font-size: 1.8em;
            }
            .footer p { 
                margin: 8px 0; 
                opacity: 0.9; 
            }
            .footer-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 30px;
                margin-top: 30px;
                text-align: left;
            }
            
            @media (max-width: 768px) {
                .container { margin: 10px; border-radius: 0; }
                .precios-container { grid-template-columns: 1fr; }
                .modelo-header { grid-template-columns: 1fr; text-align: center; }
                .cliente-grid { grid-template-columns: 1fr; }
                .header { padding: 30px 20px; }
                .header h1 { font-size: 2em; }
                .precio-clp { font-size: 1.8em; }
                .modelo-detalles { justify-content: center; }
                .footer-info { grid-template-columns: 1fr; text-align: center; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="logo_premium/1. BLANCO.png" alt="Prefabricadas Premium" class="logo">
                <h1>COTIZACIÓN PROFESIONAL</h1>
                <p>N° ${cotizacion.numero} | ${cotizacion.fecha}</p>
            </div>
            
            <div class="cliente-info">
                <h3 style="color: #0074D9; margin-bottom: 20px; font-size: 1.6em;">📋 Información del Cliente</h3>
                <div class="cliente-grid">
                    <div class="cliente-item">
                        <strong>Nombre Completo</strong>
                        <span>${cotizacion.cliente.nombre}</span>
                    </div>
                    <div class="cliente-item">
                        <strong>Correo Electrónico</strong>
                        <span>${cotizacion.cliente.email}</span>
                    </div>
                    <div class="cliente-item">
                        <strong>Teléfono</strong>
                        <span>${cotizacion.cliente.telefono}</span>
                    </div>
                    <div class="cliente-item">
                        <strong>RUT</strong>
                        <span>${cotizacion.cliente.rut}</span>
                    </div>
                    <div class="cliente-item">
                        <strong>Sucursal</strong>
                        <span>${cotizacion.sucursal.nombre}</span>
                    </div>
                    <div class="cliente-item">
                        <strong>Habitaciones Necesarias</strong>
                        <span>${cotizacion.cliente.habitaciones_necesarias}</span>
                    </div>
                </div>
            </div>
            
            <div class="modelo-section">
                <div class="modelo-header">
                    <img src="${cotizacion.modelo.imagen}" alt="${cotizacion.modelo.nombre}" class="modelo-imagen">
                    <div class="modelo-info">
                        <h2>Modelo ${cotizacion.modelo.nombre}</h2>
                        <div class="modelo-detalles">
                            <span class="detalle">${cotizacion.modelo.dormitorios} Dormitorios</span>
                            <span class="detalle">${cotizacion.modelo.baños} Baños</span>
                        </div>
                        <p style="color: #666; font-size: 1.1em; margin-top: 15px;">
                            Casa diseñada con los más altos estándares de calidad y eficiencia energética, 
                            cumpliendo con todas las normativas chilenas de construcción y resistencia sísmica.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="precios-section">
                <h3 style="color: #0074D9; margin-bottom: 30px; text-align: center; font-size: 2em;">💰 Opciones de Construcción</h3>
                <div class="precios-container">
                    ${preciosOrdenados.map(precio => `
                        <div class="precio-opcion ${precio.opcion.recomendada ? 'recomendada' : ''}" style="border-color: ${precio.opcion.color};">
                            <div class="precio-titulo" style="color: ${precio.opcion.color};">${precio.opcion.titulo}</div>
                            <div class="precio-subtitulo">${precio.opcion.subtitulo}</div>
                            <div class="precio-principal">
                                <span class="precio-clp">${precio.clp.toLocaleString('es-CL')}</span>
                                <div class="precio-uf">${precio.uf} UF (IVA incluido)</div>
                            </div>
                            <div class="precio-desglose">
                                <strong>Desglose por m²:</strong><br>
                                ${Object.entries(precio.desglose).map(([tipo, datos]) => 
                                    `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${datos.m2}m² × ${datos.precio_m2} UF = ${datos.total.toFixed(2)} UF`
                                ).join('<br>')}
                            </div>
                            <div class="incluye-titulo">✨ Esta opción incluye:</div>
                            <ul class="incluye-lista">
                                ${precio.opcion.incluye.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                            <p style="margin-top: 15px; font-style: italic; color: #666; font-size: 0.9em;">
                                ${precio.opcion.descripcion}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="uf-info">
                <strong style="font-size: 1.2em;">📊 Valor UF utilizado en esta cotización:</strong><br>
                <span style="font-size: 1.4em; color: #0074D9; font-weight: bold;">${cotizacion.uf.valor.toLocaleString('es-CL')}</span>
                <br><small>Fecha: ${cotizacion.uf.fecha}</small>
            </div>
            
            <div class="vigencia">
                <strong style="font-size: 1.2em;">⏰ Vigencia de esta cotización:</strong><br>
                <span style="font-size: 1.3em;">Válida hasta el ${cotizacion.vigencia}</span><br>
                <small>(15 días corridos desde la fecha de emisión)</small>
            </div>
            
            ${cotizacion.financiamiento.solicitado ? `
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 30px; margin: 30px; border-radius: 15px; border-left: 5px solid #28a745;">
                <h3 style="color: #155724; margin-bottom: 20px; text-align: center; font-size: 1.4em;">💳 Información de Financiamiento</h3>
                <div style="text-align: center;">
                    <p><strong>Monto solicitado:</strong> ${parseInt(cotizacion.financiamiento.monto || 0).toLocaleString('es-CL')}</p>
                    <p><strong>Modalidad disponible:</strong> Crédito hipotecario de autoconstrucción</p>
                    <p><strong>Financiamiento:</strong> Hasta 80% del valor del proyecto</p>
                    <p><strong>Plazo:</strong> Hasta 30 años</p>
                    <p style="margin-top: 15px; font-style: italic; color: #666;">
                        Trabajamos con todos los bancos principales y te asesoramos en la postulación 
                        a subsidios DS1, DS49 y DS19 sin costo adicional.
                    </p>
                </div>
            </div>
            ` : ''}
            
            <div class="whatsapp-section">
                <h3 style="margin-bottom: 15px;">💬 ¿Tienes consultas sobre tu cotización?</h3>
                <p>Conecta directamente con nuestro agente especializado de ${cotizacion.sucursal.nombre}</p>
                <a href="https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Hola, tengo consultas sobre la cotización ${cotizacion.numero} para el modelo ${cotizacion.modelo.nombre}" 
                   class="whatsapp-btn" target="_blank">
                    📱 Chatear por WhatsApp
                </a>
                <p style="margin-top: 15px; font-size: 0.9em; opacity: 0.9;">
                    ${cotizacion.sucursal.whatsapp} | Horario: Lunes a Viernes 9:00 - 18:00 hrs
                </p>
            </div>
            
            <div class="faq-section">
                <h3 class="faq-title">❓ Preguntas Frecuentes</h3>
                ${cotizacion.preguntas_frecuentes.map(categoria => `
                    <div class="faq-categoria">
                        <h4>${categoria.categoria}</h4>
                        ${categoria.preguntas.map(item => `
                            <div class="faq-item">
                                <div class="faq-pregunta">${item.pregunta}</div>
                                <div class="faq-respuesta">${item.respuesta}</div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                
                <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin-top: 30px; text-align: center;">
                    <strong style="color: #0074D9;">¿No encuentras la respuesta que buscas?</strong><br>
                    <p style="margin: 10px 0;">Nuestro equipo está disponible para resolver todas tus dudas</p>
                    <a href="https://wa.me/${cotizacion.sucursal.whatsapp.replace('+', '')}?text=Tengo consultas adicionales sobre casas prefabricadas" 
                       style="color: #0074D9; font-weight: bold;">Contáctanos por WhatsApp</a>
                </div>
            </div>
            
            <div class="footer">
                <h3>Prefabricadas Premium</h3>
                <p style="font-size: 1.1em; margin-bottom: 20px;">Tu casa soñada, construida con la más alta calidad</p>
                
                <div class="footer-info">
                    <div>
                        <h4 style="color: #0074D9; margin-bottom: 10px;">Contacto General</h4>
                        <p>📧 contacto@prefabricadaspremium.cl</p>
                        <p>🌐 www.prefabricadaspremium.cl</p>
                        <p>📞 +56 2 XXXX XXXX</p>
                    </div>
                    <div>
                        <h4 style="color: #0074D9; margin-bottom: 10px;">Sucursal ${cotizacion.sucursal.nombre}</h4>
                        <p>📍 ${cotizacion.sucursal.direccion}</p>
                        <p>📧 ${cotizacion.sucursal.email}</p>
                        <p>📱 ${cotizacion.sucursal.whatsapp}</p>
                    </div>
                    <div>
                        <h4 style="color: #0074D9; margin-bottom: 10px;">Certificaciones</h4>
                        <p>✓ NCh433 Resistencia sísmica</p>
                        <p>✓ Norma térmica MINVU</p>
                        <p>✓ Certificación FSC maderas</p>
                        <p>✓ ISO 9001 Calidad</p>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #555;">
                    <p style="font-size: 0.9em;">
                        Cotización generada automáticamente el ${cotizacion.fecha}<br>
                        Esta cotización es válida por 15 días corridos | Precios incluyen IVA
                    </p>
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
          precio_economico: cotizacion.precios.economica.clp,
          precio_premium: cotizacion.precios.premium.clp,
          precio_estructural: cotizacion.precios.estructural.clp,
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