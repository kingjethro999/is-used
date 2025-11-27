import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { UnusedImport } from '../reporters/types';

export interface ImportInfo {
    name: string;
    source: string;
    line: number;
    column: number;
    type: 'default' | 'named' | 'namespace';
    used: boolean;
}

export class ImportTracker {
    private imports: Map<string, ImportInfo> = new Map();
    private usages: Set<string> = new Set();

    /**
     * Track all imports in the AST
     */
    trackImports(ast: any): void {
        traverse(ast, {
            ImportDeclaration: (path) => {
                const source = path.node.source.value;
                const line = path.node.loc?.start.line || 0;
                const column = path.node.loc?.start.column || 0;

                path.node.specifiers.forEach((specifier) => {
                    if (t.isImportDefaultSpecifier(specifier)) {
                        this.imports.set(specifier.local.name, {
                            name: specifier.local.name,
                            source,
                            line,
                            column,
                            type: 'default',
                            used: false,
                        });
                    } else if (t.isImportSpecifier(specifier)) {
                        this.imports.set(specifier.local.name, {
                            name: specifier.local.name,
                            source,
                            line,
                            column,
                            type: 'named',
                            used: false,
                        });
                    } else if (t.isImportNamespaceSpecifier(specifier)) {
                        this.imports.set(specifier.local.name, {
                            name: specifier.local.name,
                            source,
                            line,
                            column,
                            type: 'namespace',
                            used: false,
                        });
                    }
                });
            },
        });
    }

    /**
     * Track usage of imported identifiers
     */
    trackUsages(ast: any): void {
        traverse(ast, {
            Identifier: (path) => {
                // Skip if this is part of an import declaration
                if (path.findParent((p) => p.isImportDeclaration())) {
                    return;
                }

                // Skip if this is the left side of a variable declaration
                if (path.findParent((p) => p.isVariableDeclarator() && p.node.id === path.node)) {
                    return;
                }

                // Skip if this is a function parameter
                if (path.findParent((p) => p.isFunctionDeclaration() || p.isFunctionExpression() || p.isArrowFunctionExpression())) {
                    const parent = path.parent;
                    if (t.isFunction(parent) && parent.params.includes(path.node as any)) {
                        return;
                    }
                }

                const name = path.node.name;
                if (this.imports.has(name)) {
                    this.usages.add(name);
                    const importInfo = this.imports.get(name)!;
                    importInfo.used = true;
                }
            },

            // Track JSX usage
            JSXIdentifier: (path) => {
                const name = path.node.name;
                if (this.imports.has(name)) {
                    this.usages.add(name);
                    const importInfo = this.imports.get(name)!;
                    importInfo.used = true;
                }
            },
        });
    }

    /**
     * Get all unused imports
     */
    getUnusedImports(): UnusedImport[] {
        const unused: UnusedImport[] = [];

        this.imports.forEach((importInfo) => {
            if (!importInfo.used) {
                unused.push({
                    name: importInfo.name,
                    from: importInfo.source,
                    line: importInfo.line,
                    column: importInfo.column,
                    fix: 'remove',
                });
            }
        });

        return unused;
    }

    /**
     * Reset tracker state
     */
    reset(): void {
        this.imports.clear();
        this.usages.clear();
    }
}
