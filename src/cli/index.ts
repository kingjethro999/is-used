#!/usr/bin/env node

import { Command } from 'commander';
import { checkCommand } from './commands/check';
import { scanCommand } from './commands/scan';

const program = new Command();

program
    .name('is-used')
    .description('A static analysis tool that detects unused imports, variables, functions, and dependencies')
    .version('1.0.0');

// Check command
program
    .command('check')
    .description('Analyze a specific file for unused code')
    .argument('<file>', 'File to analyze')
    .option('-o, --output <path>', 'Output report to file (JSON format)')
    .option('-j, --json', 'Output results as JSON')
    .action(checkCommand);

// Scan command
program
    .command('scan')
    .description('Scan a directory for unused code')
    .argument('<directory>', 'Directory to scan')
    .option('-e, --extensions <extensions>', 'File extensions to include (comma-separated)', 'js,jsx,ts,tsx')
    .option('-o, --output <path>', 'Output report to file (JSON format)')
    .option('-j, --json', 'Output results as JSON')
    .action(scanCommand);

// Analyze command (alias for scan with detailed output)
program
    .command('analyze')
    .description('Perform detailed analysis on a directory')
    .argument('<directory>', 'Directory to analyze')
    .option('-e, --extensions <extensions>', 'File extensions to include (comma-separated)', 'js,jsx,ts,tsx')
    .option('-o, --output <path>', 'Output report to file (JSON format)')
    .option('-j, --json', 'Output results as JSON')
    .action(scanCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
