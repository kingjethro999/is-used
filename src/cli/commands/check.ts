import * as path from 'path';
import { Analyzer } from '../../core/analyzer';
import { TerminalReporter } from '../../reporters/terminal';
import { JsonReporter } from '../../reporters/json';
import { FileUtils } from '../../utils/file-utils';

interface CheckOptions {
    output?: string;
    json?: boolean;
}

export async function checkCommand(filePath: string, options: CheckOptions): Promise<void> {
    const reporter = new TerminalReporter();
    const jsonReporter = new JsonReporter();
    const analyzer = new Analyzer();

    try {
        // Resolve file path
        const absolutePath = path.resolve(process.cwd(), filePath);

        // Check if file exists
        if (!FileUtils.exists(absolutePath)) {
            reporter.error(`File not found: ${filePath}`);
            process.exit(1);
        }

        // Check if it's a file
        if (!FileUtils.isFile(absolutePath)) {
            reporter.error(`Not a file: ${filePath}`);
            process.exit(1);
        }

        reporter.info(`Analyzing ${FileUtils.getRelativePath(absolutePath)}...`);

        // Analyze the file
        const result = analyzer.analyzeFile(absolutePath);

        // Output results
        if (options.json) {
            console.log(jsonReporter.report(result));
        } else {
            reporter.report(result);
        }

        // Save to file if output specified
        if (options.output) {
            jsonReporter.saveToFile(result, options.output);
            reporter.success(`Report saved to ${options.output}`);
        }

        // Exit with error code if issues found
        if (result.savings.unusedItemsCount > 0) {
            process.exit(1);
        }

    } catch (error) {
        reporter.error(`Failed to analyze file: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
