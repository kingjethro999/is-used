import * as path from 'path';
import { Parser } from '../core/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface FileDependency {
    file: string;
    imports: string[]; // Files this file imports
    importedBy: string[]; // Files that import this file
}

export class FileDependencyTracker {
    private dependencies: Map<string, FileDependency> = new Map();
    private parser: Parser;

    constructor() {
        this.parser = new Parser();
    }

    /**
     * Analyze all files and build dependency graph
     */
    analyzeFiles(files: string[]): void {
        // Initialize all files
        files.forEach(file => {
            this.dependencies.set(file, {
                file,
                imports: [],
                importedBy: []
            });
        });

        // Build dependency graph
        files.forEach(file => {
            try {
                const imports = this.extractImports(file, files);
                const dep = this.dependencies.get(file)!;
                dep.imports = imports;

                // Update importedBy for each imported file
                imports.forEach(importedFile => {
                    const importedDep = this.dependencies.get(importedFile);
                    if (importedDep) {
                        importedDep.importedBy.push(file);
                    }
                });
            } catch (error) {
                // Skip files that can't be parsed
                console.error(`Error analyzing ${file}: ${error}`);
            }
        });
    }

    /**
     * Extract import paths from a file
     */
    private extractImports(filePath: string, allFiles: string[]): string[] {
        const imports: string[] = [];

        try {
            const { ast } = this.parser.parseFile(filePath);
            const fileDir = path.dirname(filePath);

            traverse(ast, {
                ImportDeclaration: (path) => {
                    const importPath = path.node.source.value;
                    const resolvedPath = this.resolveImportPath(importPath, fileDir, allFiles);
                    if (resolvedPath) {
                        imports.push(resolvedPath);
                    }
                },
                // Handle dynamic imports and require() calls
                CallExpression: (callPath) => {
                    // Dynamic import()
                    if (
                        t.isImport(callPath.node.callee) &&
                        callPath.node.arguments.length > 0 &&
                        t.isStringLiteral(callPath.node.arguments[0])
                    ) {
                        const importPath = callPath.node.arguments[0].value;
                        const resolvedPath = this.resolveImportPath(importPath, fileDir, allFiles);
                        if (resolvedPath) {
                            imports.push(resolvedPath);
                        }
                    }

                    // require() calls
                    if (
                        t.isIdentifier(callPath.node.callee) &&
                        callPath.node.callee.name === 'require' &&
                        callPath.node.arguments.length > 0 &&
                        t.isStringLiteral(callPath.node.arguments[0])
                    ) {
                        const importPath = callPath.node.arguments[0].value;
                        const resolvedPath = this.resolveImportPath(importPath, fileDir, allFiles);
                        if (resolvedPath) {
                            imports.push(resolvedPath);
                        }
                    }
                }
            });
        } catch (error) {
            // Ignore parse errors
        }

        return [...new Set(imports)]; // Remove duplicates
    }

    /**
     * Resolve import path to absolute file path
     */
    private resolveImportPath(importPath: string, fileDir: string, allFiles: string[]): string | null {
        // Skip node_modules imports
        if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
            return null;
        }

        // Resolve relative path
        let resolvedPath = path.resolve(fileDir, importPath);

        // Try different extensions if no extension provided
        const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.mjs', '.cjs'];

        // Check if file exists with current path
        if (allFiles.includes(resolvedPath)) {
            return resolvedPath;
        }

        // Try adding extensions
        for (const ext of extensions) {
            const pathWithExt = resolvedPath + ext;
            if (allFiles.includes(pathWithExt)) {
                return pathWithExt;
            }
        }

        // Try index files in directory
        for (const ext of extensions) {
            const indexPath = path.join(resolvedPath, `index${ext}`);
            if (allFiles.includes(indexPath)) {
                return indexPath;
            }
        }

        return null;
    }

    /**
     * Get files that are not imported by any other file
     */
    getUnusedFiles(entryPoints: string[] = []): string[] {
        const unusedFiles: string[] = [];

        this.dependencies.forEach((dep, file) => {
            // Skip entry points (files that don't need to be imported)
            const isEntryPoint = entryPoints.some(entry => file.includes(entry));

            // A file is unused if:
            // 1. It's not an entry point
            // 2. No other files import it
            if (!isEntryPoint && dep.importedBy.length === 0) {
                unusedFiles.push(file);
            }
        });

        return unusedFiles;
    }

    /**
     * Get dependency info for a specific file
     */
    getFileDependency(file: string): FileDependency | undefined {
        return this.dependencies.get(file);
    }

    /**
     * Get all dependencies
     */
    getAllDependencies(): Map<string, FileDependency> {
        return this.dependencies;
    }

    /**
     * Reset tracker
     */
    reset(): void {
        this.dependencies.clear();
    }
}
