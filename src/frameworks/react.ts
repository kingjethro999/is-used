import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface ReactAnalysis {
    unusedHooks: Array<{
        name: string;
        line: number;
        type: string;
    }>;
    unusedProps: Array<{
        name: string;
        component: string;
        line: number;
    }>;
}

export class ReactAnalyzer {
    /**
     * Analyze React-specific patterns
     */
    analyzeReact(ast: any): ReactAnalysis {
        const unusedHooks: ReactAnalysis['unusedHooks'] = [];
        const unusedProps: ReactAnalysis['unusedProps'] = [];

        // Track React hooks
        const hooks = new Map<string, { line: number; type: string; used: boolean }>();
        const hookUsages = new Set<string>();

        traverse(ast, {
            // Track hook declarations
            VariableDeclarator: (path) => {
                if (t.isCallExpression(path.node.init)) {
                    const callee = path.node.init.callee;

                    // Check if it's a React hook (useState, useEffect, etc.)
                    if (t.isIdentifier(callee) && callee.name.startsWith('use')) {
                        if (t.isArrayPattern(path.node.id)) {
                            // useState, useReducer pattern: const [state, setState] = useState()
                            path.node.id.elements.forEach((element) => {
                                if (element && t.isIdentifier(element)) {
                                    hooks.set(element.name, {
                                        line: path.node.loc?.start.line || 0,
                                        type: callee.name,
                                        used: false,
                                    });
                                }
                            });
                        } else if (t.isIdentifier(path.node.id)) {
                            // Other hooks: const ref = useRef()
                            hooks.set(path.node.id.name, {
                                line: path.node.loc?.start.line || 0,
                                type: callee.name,
                                used: false,
                            });
                        }
                    }
                }
            },

            // Track hook usages
            Identifier: (path) => {
                const name = path.node.name;
                if (hooks.has(name)) {
                    // Skip if this is the declaration itself
                    if (!path.findParent((p) => p.isVariableDeclarator() && p.node.id === path.node)) {
                        hookUsages.add(name);
                        const hookInfo = hooks.get(name)!;
                        hookInfo.used = true;
                    }
                }
            },
        });

        // Find unused hooks
        hooks.forEach((hookInfo, name) => {
            if (!hookInfo.used) {
                unusedHooks.push({
                    name,
                    line: hookInfo.line,
                    type: hookInfo.type,
                });
            }
        });

        return { unusedHooks, unusedProps };
    }

    /**
     * Check if file is a React component
     */
    isReactFile(ast: any): boolean {
        let hasReactImport = false;
        let hasJSX = false;

        traverse(ast, {
            ImportDeclaration: (path) => {
                if (path.node.source.value === 'react') {
                    hasReactImport = true;
                }
            },
            JSXElement: () => {
                hasJSX = true;
            },
        });

        return hasReactImport || hasJSX;
    }
}
