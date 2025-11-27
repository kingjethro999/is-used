import { Parser } from './parser';
import { ImportTracker } from './import-tracker';
import { ScopeTracker } from './scope-tracker';
import { AnalysisResult, AnalysisOptions, UsedItem } from '../reporters/types';

export class Analyzer {
    private parser: Parser;
    private importTracker: ImportTracker;
    private scopeTracker: ScopeTracker;

    constructor() {
        this.parser = new Parser();
        this.importTracker = new ImportTracker();
        this.scopeTracker = new ScopeTracker();
    }

    /**
     * Analyze a single file for unused code
     */
    analyzeFile(filePath: string, options: AnalysisOptions = {}): AnalysisResult {
        // Reset trackers
        this.importTracker.reset();
        this.scopeTracker.reset();

        // Parse the file
        const { ast, code } = this.parser.parseFile(filePath);

        // Track imports
        this.importTracker.trackImports(ast);
        this.importTracker.trackUsages(ast);

        // Track variables and functions
        this.scopeTracker.trackVariables(ast);
        this.scopeTracker.trackFunctions(ast);
        this.scopeTracker.trackUsages(ast);

        // Get unused items
        const unusedImports = this.importTracker.getUnusedImports();
        const unusedVariables = this.scopeTracker.getUnusedVariables();
        const unusedFunctions = this.scopeTracker.getUnusedFunctions();

        // Calculate savings
        const unusedItemsCount = unusedImports.length + unusedVariables.length + unusedFunctions.length;
        const estimatedBytes = unusedItemsCount * 50; // Rough estimate
        const estimatedSizeReduction = this.formatBytes(estimatedBytes);

        // Get used items (for reporting)
        const usedItems: UsedItem[] = [];

        return {
            file: filePath,
            unusedImports,
            unusedVariables,
            unusedFunctions,
            usedItems,
            savings: {
                estimatedSizeReduction,
                unusedItemsCount,
            },
        };
    }

    /**
     * Analyze multiple files
     */
    analyzeFiles(filePaths: string[], options: AnalysisOptions = {}): AnalysisResult[] {
        return filePaths.map(filePath => this.analyzeFile(filePath, options));
    }

    /**
     * Format bytes to human-readable string
     */
    private formatBytes(bytes: number): string {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
}
