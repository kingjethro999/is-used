import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface VueAnalysis {
    unusedComputed: Array<{
        name: string;
        line: number;
    }>;
    unusedMethods: Array<{
        name: string;
        line: number;
    }>;
    unusedData: Array<{
        name: string;
        line: number;
    }>;
}

export class VueAnalyzer {
    /**
     * Analyze Vue-specific patterns
     */
    analyzeVue(ast: any): VueAnalysis {
        const unusedComputed: VueAnalysis['unusedComputed'] = [];
        const unusedMethods: VueAnalysis['unusedMethods'] = [];
        const unusedData: VueAnalysis['unusedData'] = [];

        // Track computed properties
        const computed = new Map<string, { line: number; used: boolean }>();
        const methods = new Map<string, { line: number; used: boolean }>();
        const dataProps = new Map<string, { line: number; used: boolean }>();
        const usages = new Set<string>();

        traverse(ast, {
            // Track Vue component options
            ObjectExpression: (path) => {
                // Check if this is a Vue component options object
                const parent = path.parent;

                // Look for computed properties
                path.node.properties.forEach((prop) => {
                    if (
                        t.isObjectProperty(prop) &&
                        t.isIdentifier(prop.key) &&
                        prop.key.name === 'computed' &&
                        t.isObjectExpression(prop.value)
                    ) {
                        // Track each computed property
                        prop.value.properties.forEach((computedProp) => {
                            if (t.isObjectProperty(computedProp) || t.isObjectMethod(computedProp)) {
                                const key = computedProp.key;
                                if (t.isIdentifier(key)) {
                                    computed.set(key.name, {
                                        line: computedProp.loc?.start.line || 0,
                                        used: false,
                                    });
                                }
                            }
                        });
                    }

                    // Look for methods
                    if (
                        t.isObjectProperty(prop) &&
                        t.isIdentifier(prop.key) &&
                        prop.key.name === 'methods' &&
                        t.isObjectExpression(prop.value)
                    ) {
                        // Track each method
                        prop.value.properties.forEach((methodProp) => {
                            if (t.isObjectProperty(methodProp) || t.isObjectMethod(methodProp)) {
                                const key = methodProp.key;
                                if (t.isIdentifier(key)) {
                                    methods.set(key.name, {
                                        line: methodProp.loc?.start.line || 0,
                                        used: false,
                                    });
                                }
                            }
                        });
                    }

                    // Look for data function
                    if (
                        t.isObjectMethod(prop) &&
                        t.isIdentifier(prop.key) &&
                        prop.key.name === 'data'
                    ) {
                        // Track properties returned from data()
                        traverse(
                            prop as any,
                            {
                                ReturnStatement: (returnPath) => {
                                    if (t.isObjectExpression(returnPath.node.argument)) {
                                        returnPath.node.argument.properties.forEach((dataProp) => {
                                            if (t.isObjectProperty(dataProp)) {
                                                const key = dataProp.key;
                                                if (t.isIdentifier(key)) {
                                                    dataProps.set(key.name, {
                                                        line: dataProp.loc?.start.line || 0,
                                                        used: false,
                                                    });
                                                }
                                            }
                                        });
                                    }
                                },
                            },
                            path.scope,
                            path.state,
                            path
                        );
                    }
                });
            },

            // Track usages via this.propertyName
            MemberExpression: (path) => {
                if (
                    t.isThisExpression(path.node.object) &&
                    t.isIdentifier(path.node.property)
                ) {
                    const propName = path.node.property.name;
                    usages.add(propName);

                    // Mark as used
                    if (computed.has(propName)) {
                        computed.get(propName)!.used = true;
                    }
                    if (methods.has(propName)) {
                        methods.get(propName)!.used = true;
                    }
                    if (dataProps.has(propName)) {
                        dataProps.get(propName)!.used = true;
                    }
                }
            },
        });

        // Find unused items
        computed.forEach((info, name) => {
            if (!info.used) {
                unusedComputed.push({ name, line: info.line });
            }
        });

        methods.forEach((info, name) => {
            if (!info.used) {
                unusedMethods.push({ name, line: info.line });
            }
        });

        dataProps.forEach((info, name) => {
            if (!info.used) {
                unusedData.push({ name, line: info.line });
            }
        });

        return { unusedComputed, unusedMethods, unusedData };
    }

    /**
     * Check if file is a Vue component
     */
    isVueFile(ast: any, filePath: string): boolean {
        // Check file extension
        if (filePath.endsWith('.vue')) {
            return true;
        }

        // Check for Vue imports
        let hasVueImport = false;
        let hasVueComponent = false;

        traverse(ast, {
            ImportDeclaration: (path) => {
                if (path.node.source.value === 'vue' || path.node.source.value.startsWith('@vue/')) {
                    hasVueImport = true;
                }
            },
            // Check for defineComponent, createApp, etc.
            CallExpression: (path) => {
                if (t.isIdentifier(path.node.callee)) {
                    const calleeName = path.node.callee.name;
                    if (
                        calleeName === 'defineComponent' ||
                        calleeName === 'createApp' ||
                        calleeName === 'defineAsyncComponent'
                    ) {
                        hasVueComponent = true;
                    }
                }
            },
        });

        return hasVueImport || hasVueComponent;
    }
}
