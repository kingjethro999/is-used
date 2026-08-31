import * as path from 'path';
import { Analyzer } from '../../core/analyzer';
import { FileDependencyTracker } from '../../core/file-dependency-tracker';
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
    const dependencyTracker = new FileDependencyTracker();

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
            : ['.js', '.jsx', '.ts', '.tsx', '.vue'];

        // Get all files
        const spinner = ora('Scanning files...').start();
        const files = FileUtils.getFilesRecursively(absolutePath, extensions);
        spinner.succeed(`Found ${files.length} files`);

        if (files.length === 0) {
            reporter.info('No files found to analyze');
            return;
        }

        // Analyze files for unused code
        const analyzeSpinner = ora('Analyzing files...').start();
        const results = analyzer.analyzeFiles(files);
        analyzeSpinner.succeed('Analysis complete');

        // Detect unused files
        const depSpinner = ora('Detecting unused files...').start();
        dependencyTracker.analyzeFiles(files);

        // Common entry points that don't need to be imported
        const entryPoints = [
            'index',
            'main',
            'app',
            'App',
            '_app',
            'server',
            'config',
            '.config',
            '.test',
            '.spec',
            'test',
            'spec'
        ];

        const unusedFiles = dependencyTracker.getUnusedFiles(entryPoints);
        depSpinner.succeed(`Found ${unusedFiles.length} unused files`);

        // Output results
        if (options.json) {
            const projectResult = {
                files: results,
                unusedFiles,
                summary: {
                    totalFiles: files.length,
                    totalUnusedFiles: unusedFiles.length,
                    totalUnusedItems: results.reduce((sum, r) => sum + r.savings.unusedItemsCount, 0)
                }
            };
            console.log(jsonReporter.reportProject(projectResult));
        } else {
            reporter.report(results);

            // Report unused files
            if (unusedFiles.length > 0) {
                reporter.reportUnusedFiles(unusedFiles, absolutePath);
            }
        }

        // Save to file if output specified
        if (options.output) {
            const projectResult = {
                files: results,
                unusedFiles,
                summary: {
                    totalFiles: files.length,
                    totalUnusedFiles: unusedFiles.length,
                    totalUnusedItems: results.reduce((sum, r) => sum + r.savings.unusedItemsCount, 0)
                }
            };
            jsonReporter.saveProjectToFile(projectResult, options.output);
            reporter.success(`Report saved to ${options.output}`);
        }

        // Exit with error code if issues found
        const totalIssues = results.reduce((sum, r) => sum + r.savings.unusedItemsCount, 0);
        if (totalIssues > 0 || unusedFiles.length > 0) {
            process.exit(1);
        }

    } catch (error) {
        reporter.error(`Failed to scan directory: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
