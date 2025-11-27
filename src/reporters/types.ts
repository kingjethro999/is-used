export interface AnalysisResult {
    file: string;
    unusedImports: UnusedImport[];
    unusedVariables: UnusedVariable[];
    unusedFunctions: UnusedFunction[];
    usedItems: UsedItem[];
    savings: {
        estimatedSizeReduction: string;
        unusedItemsCount: number;
    };
}

export interface UnusedImport {
    name: string;
    from: string;
    line: number;
    column: number;
    fix: 'remove';
}

export interface UnusedVariable {
    name: string;
    type: 'const' | 'let' | 'var';
    line: number;
    column: number;
    fix: 'remove';
}

export interface UnusedFunction {
    name: string;
    type: 'function' | 'arrow' | 'method';
    line: number;
    column: number;
    fix: 'remove';
}

export interface UsedItem {
    name: string;
    type: 'import' | 'variable' | 'function' | 'class';
    line: number;
}

export interface AnalysisOptions {
    extensions?: string[];
    framework?: 'react' | 'vue' | 'angular' | 'none';
    checkHooks?: boolean;
    checkProps?: boolean;
    ignorePatterns?: string[];
}

export interface ConfigFile {
    include: string[];
    exclude: string[];
    framework?: 'react' | 'vue' | 'angular' | 'svelte';
    rules: {
        imports: boolean;
        variables: boolean;
        functions: boolean;
        classes: boolean;
        interfaces: boolean;
        enums: boolean;
        hooks?: boolean;
        props?: boolean;
        computed?: boolean;
    };
    fix?: {
        imports: boolean;
        comments: 'preserve' | 'remove';
        exports: boolean;
    };
}
