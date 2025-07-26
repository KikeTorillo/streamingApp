#!/usr/bin/env node

/**
 * pg-kik - PostgreSQL Query Tool
 * Entry point para la CLI
 */

import { program } from 'commander';
import { PgKikCore } from '../src/core.js';
import chalk from 'chalk';

const pgkik = new PgKikCore();

program
  .name('pg-kik')
  .description('PostgreSQL Query Tool - Simple CLI para consultas y exploración')
  .version('1.0.0');

// Comando: query
program
  .command('query <sql>')
  .description('Ejecutar una consulta SQL SELECT')
  .option('-l, --limit <number>', 'Límite de resultados', '50')
  .option('-f, --format <type>', 'Formato de salida (table|json|csv)', 'table')
  .action(async (sql, options) => {
    try {
      await pgkik.query(sql, options);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Comando: tables
program
  .command('tables')
  .description('Listar todas las tablas de la base de datos')
  .action(async () => {
    try {
      await pgkik.listTables();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Comando: describe
program
  .command('describe <table>')
  .alias('desc')
  .description('Mostrar estructura de una tabla')
  .action(async (table) => {
    try {
      await pgkik.describeTable(table);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Comando: count
program
  .command('count <table>')
  .description('Contar registros en una tabla')
  .action(async (table) => {
    try {
      await pgkik.countTable(table);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Comando: config
program
  .command('config')
  .description('Mostrar configuración actual')
  .action(async () => {
    try {
      await pgkik.showConfig();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Comando: test
program
  .command('test')
  .description('Probar conexión a la base de datos')
  .action(async () => {
    try {
      await pgkik.testConnection();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Manejo de errores globales
process.on('uncaughtException', (error) => {
  console.error(chalk.red('\n💥 Error inesperado:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\n💥 Promise rechazada:'), error.message);
  process.exit(1);
});

// Ejecutar programa
program.parse();