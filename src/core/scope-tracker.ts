import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { UnusedVariable, UnusedFunction } from '../reporters/types';

interface VariableInfo {
    name: string;
    type: 'const' | 'let' | 'var';
    line: number;
    column: number;
    used: boolean;
    scope: string;
}

interface FunctionInfo {
    name: string;
    type: 'function' | 'arrow' | 'method';
    line: number;
    column: number;
    used: boolean;
    exported: boolean;
}

export class ScopeTracker {
    private variables: Map<string, VariableInfo> = new Map();
    private functions: Map<string, FunctionInfo> = new Map();
    private usages: Set<string> = new Set();

    /**
     * Track all variable declarations
     */
    trackVariables(ast: any): void {
        traverse(ast, {
            VariableDeclarator: (path) => {
                if (t.isIdentifier(path.node.id)) {
                    const name = path.node.id.name;
                    const parent = path.findParent((p) => p.isVariableDeclaration());

                    if (parent && t.isVariableDeclaration(parent.node)) {
                        this.variables.set(name, {
                            name,
                            type: parent.node.kind as 'const' | 'let' | 'var',
                            line: path.node.loc?.start.line || 0,
                            column: path.node.loc?.start.column || 0,
                            used: false,
                            scope: 'local',
                        });
                    }
                }
            },
        });
    }

    /**
     * Track all function declarations
     */
    trackFunctions(ast: any): void {
        traverse(ast, {
            FunctionDeclaration: (path) => {
                if (path.node.id && t.isIdentifier(path.node.id)) {
                    const name = path.node.id.name;
                    const isExported = this.isExported(path);

                    this.functions.set(name, {
                        name,
                        type: 'function',
                        line: path.node.loc?.start.line || 0,
                        column: path.node.loc?.start.column || 0,
                        used: isExported, // Exported functions are considered used
                        exported: isExported,
                    });
                }
            },

            ArrowFunctionExpression: (path) => {
                const parent = path.parent;
                if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
                    const name = parent.id.name;
                    const isExported = this.isExported(path);

                    this.functions.set(name, {
                        name,
                        type: 'arrow',
                        line: path.node.loc?.start.line || 0,
                        column: path.node.loc?.start.column || 0,
                        used: isExported,
                        exported: isExported,
                    });
                }
            },
        });
    }

    /**
     * Track usage of variables and functions
     */
    trackUsages(ast: any): void {
        traverse(ast, {
            Identifier: (path) => {
                // Skip declarations
                if (path.findParent((p) => p.isVariableDeclarator() && p.node.id === path.node)) {
                    return;
                }

                // Skip function names in declarations
                if (path.findParent((p) => p.isFunctionDeclaration() && p.node.id === path.node)) {
                    return;
                }

                const name = path.node.name;

                // Mark variable as used
                if (this.variables.has(name)) {
                    this.usages.add(name);
                    const varInfo = this.variables.get(name)!;
                    varInfo.used = true;
                }

                // Mark function as used
                if (this.functions.has(name)) {
                    this.usages.add(name);
                    const funcInfo = this.functions.get(name)!;
                    funcInfo.used = true;
                }
            },
        });
    }

    /**
     * Check if a path is exported
     */
    private isExported(path: any): boolean {
        return !!path.findParent((p: any) =>
            p.isExportNamedDeclaration() ||
            p.isExportDefaultDeclaration()
        );
    }

    /**
     * Get all unused variables
     */
    getUnusedVariables(): UnusedVariable[] {
        const unused: UnusedVariable[] = [];

        this.variables.forEach((varInfo) => {
            if (!varInfo.used) {
                unused.push({
                    name: varInfo.name,
                    type: varInfo.type,
                    line: varInfo.line,
                    column: varInfo.column,
                    fix: 'remove',
                });
            }
        });

        return unused;
    }

    /**
     * Get all unused functions
     */
    getUnusedFunctions(): UnusedFunction[] {
        const unused: UnusedFunction[] = [];

        this.functions.forEach((funcInfo) => {
            if (!funcInfo.used) {
                unused.push({
                    name: funcInfo.name,
                    type: funcInfo.type,
                    line: funcInfo.line,
                    column: funcInfo.column,
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
        this.variables.clear();
        this.functions.clear();
        this.usages.clear();
    }
}
