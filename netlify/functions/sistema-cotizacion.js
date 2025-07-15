// sistema-cotizacion-completo.js - Sistema Final v5.0

class SistemaCotizacionCompleto {
  constructor() {
    this.valorUF = null;
    this.fechaUF = null;
    
    // Configuración de sucursales con WhatsApp
    this.sucursales = {
      'La Serena': {
        whatsapp: '+56955278508',
        nombre: 'La Serena',
        direccion: 'Parcela Vega Sur 53, La Serena',
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
        direccion: 'Sector Piedra Colgada, Copiapó',
        email: 'ffabrega@prefabricadaspremium.cl'
      }
    };

    // Tarifas por m² en UF - Sistema actualizado con todas las combinaciones
    this.tarifas = {
      'MADERA_TINGLADO': { util: 3.6, terraza: 2, entrepiso: null, logia: 2.7 },
      'MADERA_OSB': { util: 3.6, terraza: 2, entrepiso: 0.72, logia: 2.7 },
      'MADERA_VOLCANBOARD': { util: 4.1, terraza: 2, entrepiso: 0.72, logia: 3 },
      'SIP_VOLCANBOARD': { util: 4.8, terraza: 2, entrepiso: 0.72, logia: 3 },
      'SIP_OSB': { util: 3.6, terraza: 2, entrepiso: 0.72, logia: 3 },
      'METALCON_VOLCANBOARD': { util: 4.6, terraza: 2, entrepiso: 1.72, logia: 3 },
      'METALCON_OSB': { util: 4.1, terraza: 2, entrepiso: 1.72, logia: 3 }
    };

    // Modelos definitivos con M² reales - Variantes A actualizado
    this.modelos = {
      'Milán': {
        m2_utiles: 230,
        m2_terraza: 81,
        entrepiso: 84,
        logia: 0,
        imagen: 'modelos/milan.jpg',
        dormitorios: 5,
        baños: 4,
        pdf: 'pdfs/milan.pdf',
        descripcion: 'Casa familiar de gran tamaño con espacios amplios y distribución premium'
      },
      'Marbella': {
        m2_utiles: 139,
        m2_terraza: 50,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/marbella.jpg',
        dormitorios: 4,
        baños: 2,
        pdf: 'pdfs/marbella.pdf',
        descripcion: 'Diseño moderno de 4 dormitorios con amplia terraza'
      },
      'Praga': {
        m2_utiles: 180,
        m2_terraza: 18,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/praga.jpg',
        dormitorios: 4,
        baños: 3,
        pdf: 'pdfs/praga.pdf',
        descripcion: 'Casa de 4 dormitorios con distribución eficiente'
      },
      'Barcelona': {
        m2_utiles: 150,
        m2_terraza: 9,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/barcelona.jpg',
        dormitorios: 3,
        baños: 2,
        pdf: 'pdfs/barcelona.pdf',
        descripcion: 'Casa mediterránea de 3 dormitorios con estilo clásico'
      },
      'Málaga': {
        m2_utiles: 139,
        m2_terraza: 25,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/malaga.jpg',
        dormitorios: 3,
        baños: 2,
        pdf: 'pdfs/malaga.pdf',
        descripcion: 'Diseño compacto y funcional con terraza integrada'
      },
      'Capri': {
        m2_utiles: 92,
        m2_terraza: 36,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/capri.jpg',
        dormitorios: 3,
        baños: 2,
        pdf: 'pdfs/capri.pdf',
        descripcion: 'Casa acogedora con terraza generosa para la vida al aire libre'
      },
      'Cádiz': {
        m2_utiles: 114,
        m2_terraza: 11,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/cadiz.jpg',
        dormitorios: 3,
        baños: 2,
        pdf: 'pdfs/cadiz.pdf',
        descripcion: 'Casa de tamaño medio con distribución práctica y funcional'
      },
      'Toscana': {
        m2_utiles: 72,
        m2_terraza: 0,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/toscana.jpg',
        dormitorios: 3,
        baños: 2,
        pdf: 'pdfs/toscana.pdf',
        descripcion: 'Casa starter perfecta para comenzar, diseño compacto e inteligente'
      },
      'Mónaco': {
        m2_utiles: 132,
        m2_terraza: 15,
        entrepiso: 36,
        logia: 7,
        imagen: 'modelos/monaco.jpg',
        dormitorios: 3,
        baños: 2,
        pdf: 'pdfs/monaco.pdf',
        descripcion: 'Casa de 2 pisos con espacios diferenciados y logia privada'
      },
      'Eclipse': {
        m2_utiles: 86,
        m2_terraza: 0,
        entrepiso: 36,
        logia: 0,
        imagen: 'modelos/eclipse.jpg',
        dormitorios: 3,
        baños: 2,
        pdf: 'pdfs/eclipse.pdf',
        descripcion: 'Diseño moderno de 2 pisos compacto y eficiente'
      },
      'Amalfitano': {
        m2_utiles: 230,
        m2_terraza: 71,
        entrepiso: 0,
        logia: 0,
        imagen: 'modelos/amalfitano.jpg',
        dormitorios: 4,
        baños: 3,
        pdf: 'pdfs/amalfitano.pdf',
        descripcion: 'Casa premium de gran tamaño en un piso con diseño mediterráneo'
      }
    };

    // Tres opciones principales para cotización
    this.opcionesRecomendadas = {
      economica: {
        titulo: 'Panel Madera',
        subtitulo: 'Madera + OSB',
        descripcion: 'Excelente relación calidad-precio para tu primera casa',
        material: 'MADERA',
        revestimiento: 'OSB',
        color: '#6c757d',
        orden: 1,
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
        orden: 2,
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
        orden: 3,
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

    // Preguntas frecuentes actualizadas
    this.preguntasFrecuentes = [
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
  }

  // Método de inicialización (para compatibilidad con Netlify)
  async init() {
    return await this.obtenerValorUF();
  }

  // Obtener valor actual de la UF
  async obtenerValorUF() {
    try {
      let fetch;
      if (typeof window !== 'undefined') {
        // Entorno browser
        fetch = window.fetch;
      } else {
        // Entorno Node.js
        fetch = require('node-fetch');
      }
      
      const response = await fetch('https://mindicador.cl/api/uf');
      const data = await response.json();
      
      if (data && data.serie && data.serie[0]) {
        this.valorUF = parseFloat(data.serie[0].valor);
        this.fechaUF = new Date(data.serie[0].fecha).toLocaleDateString('es-CL');
        console.log(`UF obtenida: ${this.valorUF.toLocaleString('es-CL')} (${this.fechaUF})`);
        return true;
      }
    } catch (error) {
      console.error('Error al obtener UF:', error);
      this.valorUF = 37500; // Valor de respaldo
      this.fechaUF = new Date().toLocaleDateString('es-CL');
      console.log(`Usando UF de respaldo: ${this.valorUF.toLocaleString('es-CL')}`);
    }
    return false;
  }

  // Calcular precio para una configuración específica
  calcularPrecioConfiguracion(modelo, material, revestimiento) {
    const configuracion = this.modelos[modelo];
    if (!configuracion) return null;

    const tarifa = this.tarifas[`${material}_${revestimiento}`];
    if (!tarifa) return null;

    let totalUF = 0;
    let desglose = {};

    // Calcular cada tipo de área
    if (configuracion.m2_utiles) {
      const precioUtiles = configuracion.m2_utiles * tarifa.util;
      totalUF += precioUtiles;
      desglose.utiles = { 
        m2: configuracion.m2_utiles, 
        precio_m2: tarifa.util, 
        total: precioUtiles 
      };
    }

    if (configuracion.m2_terraza) {
      const precioTerraza = configuracion.m2_terraza * tarifa.terraza;
      totalUF += precioTerraza;
      desglose.terraza = { 
        m2: configuracion.m2_terraza, 
        precio_m2: tarifa.terraza, 
        total: precioTerraza 
      };
    }

    if (configuracion.entrepiso && tarifa.entrepiso) {
      const precioEntrepiso = configuracion.entrepiso * tarifa.entrepiso;
      totalUF += precioEntrepiso;
      desglose.entrepiso = { 
        m2: configuracion.entrepiso, 
        precio_m2: tarifa.entrepiso, 
        total: precioEntrepiso 
      };
    }

    if (configuracion.logia && tarifa.logia) {
      const precioLogia = configuracion.logia * tarifa.logia;
      totalUF += precioLogia;
      desglose.logia = { 
        m2: configuracion.logia, 
        precio_m2: tarifa.logia, 
        total: precioLogia 
      };
    }

    return {
      uf: Math.round(totalUF * 100) / 100,
      clp: Math.round(totalUF * this.valorUF), // SIN IVA
      desglose: desglose,
      configuracion: configuracion
    };
  }

  // Calcular precios para las 3 opciones principales de un modelo
  calcularPrecios(nombreModelo) {
    const modelo = this.modelos[nombreModelo];
    if (!modelo) return null;

    const precios = {};

    // Calcular para cada opción recomendada
    Object.keys(this.opcionesRecomendadas).forEach(tipoOpcion => {
      const opcion = this.opcionesRecomendadas[tipoOpcion];
      
      const precio = this.calcularPrecioConfiguracion(
        nombreModelo, 
        opcion.material, 
        opcion.revestimiento
      );

      if (precio) {
        precios[tipoOpcion] = {
          ...precio,
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

  // Generar URL de WhatsApp con mensaje personalizado
  generarURLWhatsApp(cotizacion) {
    const sucursal = cotizacion.sucursal;
    const mensaje = `Hola, consultas sobre cotización ${cotizacion.numero} modelo ${cotizacion.modelo.nombre}. 

Cotización generada: ${cotizacion.fecha}
Cliente: ${cotizacion.cliente.nombre}
Teléfono: ${cotizacion.cliente.telefono}

¡Gracias!`;

    return `https://wa.me/${sucursal.whatsapp.replace('+', '')}?text=${encodeURIComponent(mensaje)}`;
  }

  // Obtener información resumida de todos los modelos para el catálogo
  obtenerCatalogoModelos() {
    const catalogoModelos = {};
    
    Object.entries(this.modelos).forEach(([nombre, modelo]) => {
      // Calcular precio base usando la opción económica (MADERA + OSB)
      const precioBase = this.calcularPrecioConfiguracion(nombre, 'MADERA', 'OSB');
      
      catalogoModelos[nombre] = {
        nombre: nombre,
        imagen: modelo.imagen,
        pdf: modelo.pdf,
        dormitorios: modelo.dormitorios,
        baños: modelo.baños,
        m2_utiles: modelo.m2_utiles,
        m2_terraza: modelo.m2_terraza,
        entrepiso: modelo.entrepiso,
        logia: modelo.logia,
        m2_total: modelo.m2_utiles + modelo.m2_terraza + modelo.entrepiso + modelo.logia,
        descripcion: modelo.descripcion,
        precio_base_uf: precioBase ? precioBase.uf : 'Consultar',
        precio_base_clp: precioBase ? precioBase.clp : null
      };
    });
    
    return catalogoModelos;
  }

  // Generar HTML profesional para cotización (para email)
  generarHTMLCotizacion(cotizacion) {
    const preciosOrdenados = ['economica', 'premium', 'estructural'].map(tipo => ({
      tipo,
      ...cotizacion.precios[tipo]
    })).filter(precio => precio.uf);

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
                flex-wrap: wrap;
                justify-content: center;
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
            
            .variantes-info {
                background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
                border: 2px solid #28a745;
                padding: 25px 30px;
                margin: 20px 30px;
                border-radius: 12px;
                text-align: center;
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
                    <span class="detalle">${cotizacion.modelo.m2_total}m² Total</span>
                    <span class="detalle">${cotizacion.modelo.m2_utiles}m² Útiles</span>
                    ${cotizacion.modelo.m2_terraza ? `<span class="detalle">${cotizacion.modelo.m2_terraza}m² Terraza</span>` : ''}
                    ${cotizacion.modelo.entrepiso ? `<span class="detalle">${cotizacion.modelo.entrepiso}m² Entrepiso</span>` : ''}
                    ${cotizacion.modelo.logia ? `<span class="detalle">${cotizacion.modelo.logia}m² Logia</span>` : ''}
                </div>
                <p style="color: #666; font-size: 1em; max-width: 600px; margin: 0 auto;">
                    ${cotizacion.modelo.descripcion}
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
                                <div class="precio-uf">${precio.uf} UF + IVA</div>
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
            
            <div class="variantes-info">
                <h3 style="color: #155724; margin-bottom: 15px;">🏠 Otros Modelos y Variantes Disponibles</h3>
                <p style="margin-bottom: 10px;"><strong>¡Esta es solo una muestra de nuestras opciones!</strong></p>
                <p>Tenemos múltiples variantes para cada modelo con diferentes metrajes, distribuciones y especificaciones técnicas.</p>
                <p style="margin-top: 10px; font-style: italic; color: #666; font-size: 0.9em;">
                    Consulta con tu agente de ventas por todas las opciones disponibles según tus necesidades específicas y presupuesto.
                </p>
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
}

// Para entorno Node.js (Netlify)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SistemaCotizacionCompleto };
}

// Para entorno browser
if (typeof window !== 'undefined') {
  window.SistemaCotizacionCompleto = SistemaCotizacionCompleto;
}