# pg-kik - PostgreSQL Query Tool

> 🚀 Herramienta CLI simple y potente para consultas PostgreSQL

## 🎯 Propósito

`pg-kik` es una herramienta de línea de comandos diseñada para simplificar las consultas y exploración de bases de datos PostgreSQL. Ideal para desarrollo, debugging y análisis de datos.

## ⚡ Instalación Rápida

```bash
# En el directorio pg-kik
npm install
npm link

# Verificar instalación
pg-kik test
```

## 🛠️ Comandos Disponibles

### 📊 Consultas de Datos
```bash
# Ejecutar consultas SELECT
pg-kik query "SELECT * FROM users LIMIT 5"

# Contar registros
pg-kik count movies

# Listar todas las tablas
pg-kik tables

# Ver estructura de una tabla
pg-kik describe users
```

### 🎨 Formatos de Salida
```bash
# Tabla visual (por defecto)
pg-kik query "SELECT * FROM categories" --format table

# JSON estructurado
pg-kik query "SELECT * FROM categories" --format json

# CSV para exportar
pg-kik query "SELECT * FROM categories" --format csv
```

### 🔧 Utilidades
```bash
# Probar conexión
pg-kik test

# Ver configuración actual
pg-kik config

# Ayuda
pg-kik --help
```

## ⚙️ Configuración

### Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=streamingApp
DB_USER=admin
DB_PASSWORD=admin123
NODE_ENV=development
```

### Múltiples Entornos (Futuro)
```bash
# Ejemplo de uso futuro
pg-kik --env production query "SELECT COUNT(*) FROM users"
pg-kik --env development tables
```

## 📈 Ejemplos de Uso

### Exploración Básica
```bash
# Ver qué tablas hay
pg-kik tables

# Explorar estructura
pg-kik describe users
pg-kik describe movies

# Contar datos
pg-kik count users
pg-kik count movies
```

### Consultas de Análisis
```bash
# Ver usuarios recientes
pg-kik query "SELECT id, user_name, created_at FROM users ORDER BY created_at DESC LIMIT 10"

# Categorías más usadas
pg-kik query "SELECT name, COUNT(*) FROM categories GROUP BY name ORDER BY count DESC"

# Exportar datos
pg-kik query "SELECT * FROM movies" --format csv > movies_backup.csv
```

## 🛡️ Características de Seguridad

- ✅ **Solo SELECT**: MVP limitado a consultas de lectura
- ✅ **Pool de conexiones**: Gestión eficiente de recursos
- ✅ **Validación de entrada**: Prevención de consultas maliciosas
- ✅ **Timeouts**: Evita consultas que cuelguen el sistema

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] **Múltiples entornos**: `--env production|staging|dev`
- [ ] **Consultas guardadas**: `pg-kik save "popular-users" "SELECT ..."`
- [ ] **Búsqueda de texto**: `pg-kik search "admin" --in users`
- [ ] **Export avanzado**: `pg-kik export users --where "created_at > '2025-01-01'"`
- [ ] **Operaciones DML**: INSERT, UPDATE, DELETE (con confirmación)
- [ ] **Batch operations**: Ejecutar múltiples consultas
- [ ] **Query builder**: Interfaz para construir consultas complejas

### Integraciones Futuras
- [ ] **Backup/Restore**: Integración con pg_dump
- [ ] **Migrations**: Soporte para esquemas y migraciones
- [ ] **Monitoring**: Estadísticas de rendimiento
- [ ] **Web UI**: Interfaz web opcional

## 🧰 Desarrollo

### Estructura del Proyecto
```
pg-kik/
├── bin/pg-kik.js       # Ejecutable CLI
├── src/core.js         # Lógica principal
├── package.json        # Configuración npm
├── .env               # Variables de entorno
└── README.md          # Esta documentación
```

### Scripts de Desarrollo
```bash
npm run dev            # Modo desarrollo con auto-reload
npm run start          # Ejecutar normalmente
npm run test           # Probar conexión
```

## 🤝 Contribuir

### Agregar Nuevos Comandos
1. Agregar comando en `bin/pg-kik.js`
2. Implementar método en `src/core.js`
3. Agregar documentación aquí
4. Probar funcionalidad

### Mejoras Sugeridas
- Validaciones adicionales
- Más formatos de salida (XML, YAML)
- Autocompletado de tablas/columnas
- Historial de consultas

## 📄 Licencia

MIT - Úsala, modifícala y compártela libremente.

---

**Creado para el proyecto StreamingApp** 🎬
**Herramienta universal para cualquier proyecto PostgreSQL** 🐘