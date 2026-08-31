import * as fs from 'fs';
import { AnalysisResult, ProjectAnalysisResult } from './types';

export class JsonReporter {
    /**
     * Generate JSON report
     */
    report(results: AnalysisResult | AnalysisResult[]): string {
        const resultsArray = Array.isArray(results) ? results : [results];

        const report = {
            timestamp: new Date().toISOString(),
            filesAnalyzed: resultsArray.length,
            results: resultsArray,
            summary: this.generateSummary(resultsArray),
        };

        return JSON.stringify(report, null, 2);
    }

    /**
     * Save report to file
     */
    saveToFile(results: AnalysisResult | AnalysisResult[], outputPath: string): void {
        const jsonReport = this.report(results);
        fs.writeFileSync(outputPath, jsonReport, 'utf-8');
    }

    /**
     * Generate summary statistics
     */
    private generateSummary(results: AnalysisResult[]) {
        return {
            totalUnusedImports: results.reduce((sum, r) => sum + r.unusedImports.length, 0),
            totalUnusedVariables: results.reduce((sum, r) => sum + r.unusedVariables.length, 0),
            totalUnusedFunctions: results.reduce((sum, r) => sum + r.unusedFunctions.length, 0),
            totalUnusedItems: results.reduce((sum, r) => sum + r.savings.unusedItemsCount, 0),
            filesWithIssues: results.filter(r => r.savings.unusedItemsCount > 0).length,
        };
    }

    /**
     * Generate JSON report for project analysis
     */
    reportProject(projectResult: ProjectAnalysisResult): string {
        const report = {
            timestamp: new Date().toISOString(),
            summary: projectResult.summary,
            unusedFiles: projectResult.unusedFiles,
            fileAnalysis: projectResult.files,
        };

        return JSON.stringify(report, null, 2);
    }

    /**
     * Save project report to file
     */
    saveProjectToFile(projectResult: ProjectAnalysisResult, outputPath: string): void {
        const jsonReport = this.reportProject(projectResult);
        fs.writeFileSync(outputPath, jsonReport, 'utf-8');
    }
}
