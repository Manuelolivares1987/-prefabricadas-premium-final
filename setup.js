#!/usr/bin/env node

/**
 * Script de configuración inicial para Prefabricadas Premium v5.0
 * Ejecutar con: node setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🏠 PREFABRICADAS PREMIUM - SETUP v5.0');
console.log('=====================================\n');

// Verificar estructura de archivos
function verificarEstructura() {
  console.log('📁 Verificando estructura de archivos...');
  
  const archivosRequeridos = [
    'index.html',
    'package.json',
    'netlify.toml',
    'netlify/functions/sistema-cotizacion-completo.js',
    'netlify/functions/enviar-cotizacion.js'
  ];
  
  const carpetasRequeridas = [
    'modelos',
    'pdfs', 
    'logo_premium',
    'logo_salvum',
    'videos',
    'netlify',
    'netlify/functions'
  ];
  
  let estructuraOk = true;
  
  // Verificar archivos
  archivosRequeridos.forEach(archivo => {
    if (fs.existsSync(archivo)) {
      console.log(`  ✅ ${archivo}`);
    } else {
      console.log(`  ❌ ${archivo} - FALTANTE`);
      estructuraOk = false;
    }
  });
  
  // Verificar carpetas
  carpetasRequeridas.forEach(carpeta => {
    if (fs.existsSync(carpeta)) {
      console.log(`  ✅ ${carpeta}/`);
    } else {
      console.log(`  ⚠️  ${carpeta}/ - Creando...`);
      fs.mkdirSync(carpeta, { recursive: true });
    }
  });
  
  return estructuraOk;
}

// Verificar modelos y PDFs
function verificarRecursos() {
  console.log('\n📊 Verificando recursos...');
  
  const modelos = [
    'milan', 'marbella', 'praga', 'barcelona', 'malaga',
    'capri', 'cadiz', 'toscana', 'monaco', 'eclipse', 'amalfitano'
  ];
  
  modelos.forEach(modelo => {
    const imagen = `modelos/${modelo}.jpg`;
    const pdf = `pdfs/${modelo}.pdf`;
    
    const tieneImagen = fs.existsSync(imagen);
    const tienePdf = fs.existsSync(pdf);
    
    if (tieneImagen && tienePdf) {
      console.log(`  ✅ ${modelo} - Imagen y PDF`);
    } else {
      console.log(`  ⚠️  ${modelo} - Falta: ${!tieneImagen ? 'imagen' : ''} ${!tienePdf ? 'PDF' : ''}`);
    }
  });
}

// Verificar dependencias
function verificarDependencias() {
  console.log('\n📦 Verificando dependencias...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.dependencies && packageJson.dependencies['node-fetch']) {
      console.log('  ✅ node-fetch configurado');
    } else {
      console.log('  ❌ node-fetch faltante');
    }
    
    if (packageJson.devDependencies && packageJson.devDependencies['netlify-cli']) {
      console.log('  ✅ netlify-cli configurado');
    } else {
      console.log('  ⚠️  netlify-cli faltante (instalar con: npm install -g netlify-cli)');
    }
    
  } catch (error) {
    console.log('  ❌ Error leyendo package.json');
  }
}

// Generar ejemplo de variables de entorno
function generarEnvEjemplo() {
  console.log('\n🔐 Generando archivo de ejemplo de variables...');
  
  const envEjemplo = `# Variables de entorno para Prefabricadas Premium v5.0
# Copiar a Netlify > Site settings > Environment variables

# HubSpot (Opcional - para CRM)
HUBSPOT_API_KEY=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HUBSPOT_PORTAL_ID=12345678

# SendGrid (Requerido - para envío de emails)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxx

# Configuración adicional
NODE_VERSION=18
`;

  fs.writeFileSync('.env.example', envEjemplo);
  console.log('  ✅ Archivo .env.example creado');
}

// Verificar configuración del sistema
function verificarSistema() {
  console.log('\n⚙️  Verificando configuración del sistema...');
  
  try {
    // Verificar que el sistema de cotización tenga todos los modelos
    const sistemaPath = 'netlify/functions/sistema-cotizacion-completo.js';
    if (fs.existsSync(sistemaPath)) {
      const contenido = fs.readFileSync(sistemaPath, 'utf8');
      
      const modelos = ['Milán', 'Marbella', 'Praga', 'Barcelona', 'Málaga', 'Capri', 'Cádiz', 'Toscana', 'Mónaco', 'Eclipse', 'Amalfitano'];
      
      modelos.forEach(modelo => {
        if (contenido.includes(`'${modelo}':`)) {
          console.log(`  ✅ Modelo ${modelo} configurado`);
        } else {
          console.log(`  ❌ Modelo ${modelo} faltante en sistema`);
        }
      });
      
      // Verificar tarifas
      const tarifas = ['MADERA_OSB', 'SIP_VOLCANBOARD', 'METALCON_VOLCANBOARD'];
      tarifas.forEach(tarifa => {
        if (contenido.includes(`'${tarifa}':`)) {
          console.log(`  ✅ Tarifa ${tarifa} configurada`);
        } else {
          console.log(`  ❌ Tarifa ${tarifa} faltante`);
        }
      });
      
    } else {
      console.log('  ❌ Sistema de cotización no encontrado');
    }
  } catch (error) {
    console.log('  ❌ Error verificando sistema:', error.message);
  }
}

// Mostrar siguiente pasos
function mostrarSiguientesPasos() {
  console.log('\n🚀 SIGUIENTES PASOS:');
  console.log('===================');
  console.log('1. Instalar dependencias:');
  console.log('   npm install');
  console.log('');
  console.log('2. Configurar Netlify CLI:');
  console.log('   npm install -g netlify-cli');
  console.log('   netlify login');
  console.log('   netlify link');
  console.log('');
  console.log('3. Configurar variables de entorno en Netlify:');
  console.log('   - SENDGRID_API_KEY (requerido)');
  console.log('   - HUBSPOT_API_KEY (opcional)');
  console.log('');
  console.log('4. Subir recursos faltantes:');
  console.log('   - Imágenes de modelos en /modelos/');
  console.log('   - PDFs de planos en /pdfs/');
  console.log('   - Logos en /logo_premium/ y /logo_salvum/');
  console.log('   - Video en /videos/');
  console.log('');
  console.log('5. Probar en local:');
  console.log('   netlify dev');
  console.log('');
  console.log('6. Desplegar a producción:');
  console.log('   netlify deploy --prod');
  console.log('');
  console.log('📧 Para soporte: soporte@prefabricadaspremium.cl');
}

// Función principal
function main() {
  const estructuraOk = verificarEstructura();
  verificarRecursos();
  verificarDependencias();
  generarEnvEjemplo();
  verificarSistema();
  
  console.log('\n' + '='.repeat(50));
  
  if (estructuraOk) {
    console.log('✅ Setup completado exitosamente!');
  } else {
    console.log('⚠️  Setup completado con advertencias.');
  }
  
  mostrarSiguientesPasos();
}

// Ejecutar setup
main();