import chalk from 'chalk';
import { AnalysisResult } from './types';

export class TerminalReporter {
    /**
     * Display analysis results in the terminal
     */
    report(results: AnalysisResult | AnalysisResult[]): void {
        const resultsArray = Array.isArray(results) ? results : [results];

        console.log(chalk.cyan.bold('\n🔍 is-used Analysis Report'));
        console.log(chalk.cyan('─'.repeat(50)));

        resultsArray.forEach((result, index) => {
            if (index > 0) console.log('\n' + chalk.gray('─'.repeat(50)));
            this.reportSingleFile(result);
        });

        // Summary
        if (resultsArray.length > 1) {
            this.reportSummary(resultsArray);
        }
    }

    /**
     * Report for a single file
     */
    private reportSingleFile(result: AnalysisResult): void {
        console.log(chalk.blue(`\n📁 File: ${result.file}`));

        // Unused Imports
        if (result.unusedImports.length > 0) {
            console.log(chalk.red('\n❌ Unused Imports:'));
            result.unusedImports.forEach(imp => {
                console.log(chalk.gray(`   • ${chalk.yellow(`{ ${imp.name} }`)} from ${chalk.cyan(`'${imp.from}'`)} (line ${imp.line})`));
            });
        }

        // Unused Variables
        if (result.unusedVariables.length > 0) {
            console.log(chalk.red('\n❌ Unused Variables:'));
            result.unusedVariables.forEach(v => {
                console.log(chalk.gray(`   • ${chalk.yellow(v.type)} ${chalk.cyan(v.name)} (line ${v.line})`));
            });
        }

        // Unused Functions
        if (result.unusedFunctions.length > 0) {
            console.log(chalk.red('\n❌ Unused Functions:'));
            result.unusedFunctions.forEach(f => {
                console.log(chalk.gray(`   • ${chalk.yellow(f.type)} ${chalk.cyan(f.name)} (line ${f.line})`));
            });
        }

        // Suggestions
        if (result.savings.unusedItemsCount > 0) {
            console.log(chalk.yellow('\n💡 Suggestions:'));
            if (result.unusedImports.length > 0) {
                console.log(chalk.gray(`   • Remove ${result.unusedImports.length} unused import${result.unusedImports.length > 1 ? 's' : ''}`));
            }
            if (result.unusedVariables.length > 0) {
                console.log(chalk.gray(`   • Remove ${result.unusedVariables.length} unused variable${result.unusedVariables.length > 1 ? 's' : ''}`));
            }
            if (result.unusedFunctions.length > 0) {
                console.log(chalk.gray(`   • Remove ${result.unusedFunctions.length} unused function${result.unusedFunctions.length > 1 ? 's' : ''}`));
            }
            console.log(chalk.gray(`   • Estimated size reduction: ${chalk.green(result.savings.estimatedSizeReduction)}`));
        } else {
            console.log(chalk.green('\n✅ No unused code detected!'));
        }
    }

    /**
     * Report summary for multiple files
     */
    private reportSummary(results: AnalysisResult[]): void {
        console.log(chalk.cyan.bold('\n📊 Summary'));
        console.log(chalk.cyan('─'.repeat(50)));

        const totalFiles = results.length;
        const totalUnusedImports = results.reduce((sum, r) => sum + r.unusedImports.length, 0);
        const totalUnusedVariables = results.reduce((sum, r) => sum + r.unusedVariables.length, 0);
        const totalUnusedFunctions = results.reduce((sum, r) => sum + r.unusedFunctions.length, 0);
        const totalUnusedItems = results.reduce((sum, r) => sum + r.savings.unusedItemsCount, 0);

        console.log(chalk.white(`Files analyzed: ${chalk.cyan(totalFiles)}`));
        console.log(chalk.white(`Total unused imports: ${chalk.yellow(totalUnusedImports)}`));
        console.log(chalk.white(`Total unused variables: ${chalk.yellow(totalUnusedVariables)}`));
        console.log(chalk.white(`Total unused functions: ${chalk.yellow(totalUnusedFunctions)}`));
        console.log(chalk.white(`Total unused items: ${chalk.red(totalUnusedItems)}`));

        if (totalUnusedItems === 0) {
            console.log(chalk.green.bold('\n🎉 All files are clean!'));
        } else {
            console.log(chalk.yellow.bold(`\n⚠️  Found ${totalUnusedItems} unused items across ${totalFiles} files`));
        }
    }

    /**
     * Display error message
     */
    error(message: string): void {
        console.error(chalk.red.bold('❌ Error: ') + chalk.red(message));
    }

    /**
     * Display success message
     */
    success(message: string): void {
        console.log(chalk.green.bold('✅ ') + chalk.green(message));
    }

    /**
     * Display info message
     */
    info(message: string): void {
        console.log(chalk.blue.bold('ℹ️  ') + chalk.blue(message));
    }
}
