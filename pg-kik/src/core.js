/**
 * pg-kik Core - Lógica principal de la herramienta
 */

import pg from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';
import Table from 'cli-table3';

dotenv.config();

const { Pool } = pg;

export class PgKikCore {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'streamingApp',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'admin123',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Configurar eventos del pool
    this.pool.on('error', (err) => {
      console.error(chalk.red('❌ Error en pool PostgreSQL:'), err.message);
    });
  }

  /**
   * Ejecutar consulta SQL SELECT
   */
  async query(sql, options = {}) {
    // Validar que sea SELECT
    const cleanSql = sql.trim().toLowerCase();
    if (!cleanSql.startsWith('select')) {
      throw new Error('Solo se permiten consultas SELECT en el MVP');
    }

    const client = await this.pool.connect();
    try {
      console.log(chalk.blue('🔍 Ejecutando consulta...'));
      
      const startTime = Date.now();
      const result = await client.query(sql);
      const duration = Date.now() - startTime;

      console.log(chalk.green(`✅ Consulta ejecutada en ${duration}ms`));
      console.log(chalk.gray(`📊 ${result.rowCount} registro(s) encontrado(s)\n`));

      // Formatear salida según opción
      this.formatOutput(result.rows, options.format, result.fields);

    } finally {
      client.release();
    }
  }

  /**
   * Listar todas las tablas
   */
  async listTables() {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;

      const result = await client.query(query);
      
      console.log(chalk.blue('📋 Tablas disponibles:\n'));
      
      const table = new Table({
        head: [chalk.cyan('Tabla'), chalk.cyan('Tipo')],
        style: { head: ['cyan'] }
      });

      result.rows.forEach(row => {
        table.push([
          chalk.white(row.table_name),
          row.table_type === 'BASE TABLE' ? chalk.green('Tabla') : chalk.yellow('Vista')
        ]);
      });

      console.log(table.toString());
      console.log(chalk.gray(`\n📊 Total: ${result.rowCount} tabla(s)`));

    } finally {
      client.release();
    }
  }

  /**
   * Describir estructura de tabla
   */
  async describeTable(tableName) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position
      `;

      const result = await client.query(query, [tableName]);
      
      if (result.rowCount === 0) {
        console.log(chalk.yellow(`⚠️ Tabla '${tableName}' no encontrada`));
        return;
      }

      console.log(chalk.blue(`📋 Estructura de la tabla: ${chalk.bold(tableName)}\n`));
      
      const table = new Table({
        head: [
          chalk.cyan('Columna'),
          chalk.cyan('Tipo'),
          chalk.cyan('Nulo'),
          chalk.cyan('Por Defecto')
        ],
        style: { head: ['cyan'] }
      });

      result.rows.forEach(col => {
        const dataType = col.character_maximum_length 
          ? `${col.data_type}(${col.character_maximum_length})`
          : col.data_type;

        table.push([
          chalk.white(col.column_name),
          chalk.green(dataType),
          col.is_nullable === 'YES' ? chalk.yellow('SÍ') : chalk.red('NO'),
          col.column_default ? chalk.gray(col.column_default) : chalk.gray('-')
        ]);
      });

      console.log(table.toString());
      console.log(chalk.gray(`\n📊 Total: ${result.rowCount} columna(s)`));

    } finally {
      client.release();
    }
  }

  /**
   * Contar registros en tabla
   */
  async countTable(tableName) {
    const client = await this.pool.connect();
    try {
      // Verificar que la tabla existe
      const checkQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = $1 AND table_schema = 'public'
      `;
      
      const checkResult = await client.query(checkQuery, [tableName]);
      
      if (checkResult.rowCount === 0) {
        console.log(chalk.yellow(`⚠️ Tabla '${tableName}' no encontrada`));
        return;
      }

      console.log(chalk.blue(`🔢 Contando registros en: ${chalk.bold(tableName)}`));
      
      const startTime = Date.now();
      const countQuery = `SELECT COUNT(*) as total FROM ${tableName}`;
      const result = await client.query(countQuery);
      const duration = Date.now() - startTime;

      const count = parseInt(result.rows[0].total);
      
      console.log(chalk.green(`✅ Operación completada en ${duration}ms`));
      console.log(chalk.white(`📊 Total de registros: ${chalk.bold.green(count.toLocaleString())}`));

    } finally {
      client.release();
    }
  }

  /**
   * Mostrar configuración actual
   */
  async showConfig() {
    console.log(chalk.blue('⚙️ Configuración actual de pg-kik:\n'));
    
    const config = new Table({
      head: [chalk.cyan('Parámetro'), chalk.cyan('Valor')],
      style: { head: ['cyan'] }
    });

    config.push(
      ['Host', process.env.DB_HOST || 'localhost'],
      ['Puerto', process.env.DB_PORT || '5432'],
      ['Base de datos', process.env.DB_NAME || 'streamingApp'],
      ['Usuario', process.env.DB_USER || 'admin'],
      ['Archivo .env', process.env.NODE_ENV === 'development' ? '✅ Cargado' : '❌ No encontrado']
    );

    console.log(config.toString());
  }

  /**
   * Probar conexión
   */
  async testConnection() {
    console.log(chalk.blue('🔍 Probando conexión a PostgreSQL...\n'));
    
    try {
      const client = await this.pool.connect();
      
      // Consulta básica
      const timeResult = await client.query('SELECT NOW() as current_time, version() as version');
      const dbInfo = timeResult.rows[0];
      
      console.log(chalk.green('✅ Conexión exitosa!'));
      console.log(chalk.white(`🕐 Tiempo servidor: ${dbInfo.current_time}`));
      console.log(chalk.gray(`📋 Versión PostgreSQL: ${dbInfo.version.split(' ')[1]}`));
      
      // Probar listado de tablas
      console.log(chalk.blue('\n📋 Verificando acceso a tablas...'));
      const tablesResult = await client.query(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      client.release();
      
      const tableCount = parseInt(tablesResult.rows[0].table_count);
      console.log(chalk.green(`✅ Acceso confirmado a ${tableCount} tabla(s)`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error de conexión:'), error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(chalk.yellow('\n💡 Sugerencias:'));
        console.log('   • Verificar que PostgreSQL esté corriendo');
        console.log('   • Revisar credenciales en archivo .env');
        console.log('   • Verificar que el puerto 5432 esté disponible');
      }
      
      throw error;
    }
  }

  /**
   * Formatear salida según el tipo especificado
   */
  formatOutput(rows, format = 'table', fields = null) {
    if (rows.length === 0) {
      console.log(chalk.yellow('📭 No se encontraron resultados'));
      return;
    }

    switch (format.toLowerCase()) {
      case 'json':
        console.log(JSON.stringify(rows, null, 2));
        break;
        
      case 'csv':
        // Headers
        const csvHeaders = Object.keys(rows[0]);
        console.log(csvHeaders.join(','));
        
        // Data rows
        rows.forEach(row => {
          const values = csvHeaders.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          });
          console.log(values.join(','));
        });
        break;
        
      case 'table':
      default:
        const headers = Object.keys(rows[0]);
        const table = new Table({
          head: headers.map(h => chalk.cyan(h)),
          style: { head: ['cyan'] }
        });

        rows.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            if (value === null) return chalk.gray('NULL');
            if (typeof value === 'boolean') return value ? chalk.green('true') : chalk.red('false');
            if (typeof value === 'number') return chalk.yellow(value.toString());
            return chalk.white(value.toString());
          });
          table.push(values);
        });

        console.log(table.toString());
        break;
    }
  }

  /**
   * Cerrar conexiones
   */
  async close() {
    await this.pool.end();
  }
}