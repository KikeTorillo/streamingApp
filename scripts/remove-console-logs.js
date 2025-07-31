#!/usr/bin/env node

/**
 * Script para eliminar todos los console.logs del proyecto frontend
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_SRC = path.join(__dirname, '../frontend/app/src');

/**
 * Eliminar console.logs de un archivo
 */
function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const originalLines = content.split('\n').length;
    
    // Patrones para eliminar console statements
    const patterns = [
      // console.log completos
      /^\s*console\.log\([^;]*\);\s*$/gm,
      // console.warn completos
      /^\s*console\.warn\([^;]*\);\s*$/gm,
      // console.error completos
      /^\s*console\.error\([^;]*\);\s*$/gm,
      // console.info completos
      /^\s*console\.info\([^;]*\);\s*$/gm,
      // console.debug completos
      /^\s*console\.debug\([^;]*\);\s*$/gm,
      // logger.* statements (del intento de migración)
      /^\s*logger\.(info|warn|error|debug|success|loading)\([^;]*\);\s*$/gm,
    ];
    
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern, '');
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    });
    
    // Eliminar líneas vacías múltiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Eliminar imports de logger que ya no se usan
    const loggerImportPattern = /^import\s+logger\s+from\s+['""][^'"]*logger[^'"]*['""]\s*;\s*$/gm;
    content = content.replace(loggerImportPattern, '');
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      const newLines = content.split('\n').length;
      return { removed: originalLines - newLines, hasChanges: true };
    }
    
    return { removed: 0, hasChanges: false };
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error.message);
    return { removed: 0, hasChanges: false };
  }
}

/**
 * Buscar todos los archivos JS/JSX
 */
function findJSFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDir(fullPath);
      } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
        files.push(fullPath);
      }
    });
  }
  
  scanDir(dir);
  return files;
}

/**
 * Función principal
 */
async function main() {
  console.log('🧹 Eliminando todos los console.logs del proyecto...\n');
  
  const jsFiles = findJSFiles(FRONTEND_SRC);
  console.log(`📁 Encontrados ${jsFiles.length} archivos JS/JSX\n`);
  
  let processedFiles = 0;
  let totalLinesRemoved = 0;
  
  for (const file of jsFiles) {
    const result = removeConsoleLogs(file);
    if (result.hasChanges) {
      processedFiles++;
      totalLinesRemoved += result.removed;
      console.log(`✅ ${path.relative(FRONTEND_SRC, file)} - ${result.removed} líneas eliminadas`);
    }
  }
  
  console.log(`\n🎉 Limpieza completada:`);
  console.log(`   📄 Archivos procesados: ${processedFiles}`);
  console.log(`   🗑️  Líneas eliminadas: ${totalLinesRemoved}`);
  console.log(`\n✨ Proyecto limpio de console.logs!`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { removeConsoleLogs };