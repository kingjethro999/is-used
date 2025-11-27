import * as path from 'path';
import { Analyzer } from '../../core/analyzer';
import { TerminalReporter } from '../../reporters/terminal';
import { JsonReporter } from '../../reporters/json';
import { FileUtils } from '../../utils/file-utils';
import ora from 'ora';

interface ScanOptions {
    extensions?: string;
    output?: string;
    json?: boolean;
}

export async function scanCommand(dirPath: string, options: ScanOptions): Promise<void> {
    const reporter = new TerminalReporter();
    const jsonReporter = new JsonReporter();
    const analyzer = new Analyzer();

    try {
        // Resolve directory path
        const absolutePath = path.resolve(process.cwd(), dirPath);

        // Check if directory exists
        if (!FileUtils.exists(absolutePath)) {
            reporter.error(`Directory not found: ${dirPath}`);
            process.exit(1);
        }

        // Check if it's a directory
        if (!FileUtils.isDirectory(absolutePath)) {
            reporter.error(`Not a directory: ${dirPath}`);
            process.exit(1);
        }

        // Parse extensions
        const extensions = options.extensions
            ? FileUtils.normalizeExtensions(options.extensions.split(','))
            : ['.js', '.jsx', '.ts', '.tsx'];

        // Get all files
        const spinner = ora('Scanning files...').start();
        const files = FileUtils.getFilesRecursively(absolutePath, extensions);
        spinner.succeed(`Found ${files.length} files`);

        if (files.length === 0) {
            reporter.info('No files found to analyze');
            return;
        }

        // Analyze files
        const analyzeSpinner = ora('Analyzing files...').start();
        const results = analyzer.analyzeFiles(files);
        analyzeSpinner.succeed('Analysis complete');

        // Output results
        if (options.json) {
            console.log(jsonReporter.report(results));
        } else {
            reporter.report(results);
        }

        // Save to file if output specified
        if (options.output) {
            jsonReporter.saveToFile(results, options.output);
            reporter.success(`Report saved to ${options.output}`);
        }

        // Exit with error code if issues found
        const totalIssues = results.reduce((sum, r) => sum + r.savings.unusedItemsCount, 0);
        if (totalIssues > 0) {
            process.exit(1);
        }

    } catch (error) {
        reporter.error(`Failed to scan directory: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
