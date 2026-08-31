import { Parser } from './parser';
import { ImportTracker } from './import-tracker';
import { ScopeTracker } from './scope-tracker';
import { AnalysisResult, AnalysisOptions, UsedItem } from '../reporters/types';
import { VueAnalyzer } from '../frameworks/vue';
import { ReactAnalyzer } from '../frameworks/react';

export class Analyzer {
    private parser: Parser;
    private importTracker: ImportTracker;
    private scopeTracker: ScopeTracker;
    private vueAnalyzer: VueAnalyzer;
    private reactAnalyzer: ReactAnalyzer;

    constructor() {
        this.parser = new Parser();
        this.importTracker = new ImportTracker();
        this.scopeTracker = new ScopeTracker();
        this.vueAnalyzer = new VueAnalyzer();
        this.reactAnalyzer = new ReactAnalyzer();
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

        // Framework-specific analysis
        let unusedVueComputed: any[] | undefined;
        let unusedVueMethods: any[] | undefined;
        let unusedVueData: any[] | undefined;

        // Check if it's a Vue file
        if (this.vueAnalyzer.isVueFile(ast, filePath)) {
            const vueAnalysis = this.vueAnalyzer.analyzeVue(ast);
            unusedVueComputed = vueAnalysis.unusedComputed;
            unusedVueMethods = vueAnalysis.unusedMethods;
            unusedVueData = vueAnalysis.unusedData;
        }

        // Calculate savings
        const vueItemsCount = (unusedVueComputed?.length || 0) + (unusedVueMethods?.length || 0) + (unusedVueData?.length || 0);
        const unusedItemsCount = unusedImports.length + unusedVariables.length + unusedFunctions.length + vueItemsCount;
        const estimatedBytes = unusedItemsCount * 50; // Rough estimate
        const estimatedSizeReduction = this.formatBytes(estimatedBytes);

        // Get used items (for reporting)
        const usedItems: UsedItem[] = [];

        return {
            file: filePath,
            unusedImports,
            unusedVariables,
            unusedFunctions,
            unusedVueComputed,
            unusedVueMethods,
            unusedVueData,
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
