import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as fs from 'fs';

export interface ParsedFile {
    ast: any;
    code: string;
    filePath: string;
}

export class Parser {
    /**
     * Parse a JavaScript/TypeScript file and return its AST
     */
    parseFile(filePath: string): ParsedFile {
        const code = fs.readFileSync(filePath, 'utf-8');

        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: [
                'jsx',
                'typescript',
                'classProperties',
                'decorators-legacy',
                'dynamicImport',
                'objectRestSpread',
                'optionalChaining',
                'nullishCoalescingOperator',
            ],
        });

        return { ast, code, filePath };
    }

    /**
     * Parse code string directly
     */
    parseCode(code: string, filePath: string = 'unknown'): ParsedFile {
        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: [
                'jsx',
                'typescript',
                'classProperties',
                'decorators-legacy',
                'dynamicImport',
                'objectRestSpread',
                'optionalChaining',
                'nullishCoalescingOperator',
            ],
        });

        return { ast, code, filePath };
    }

    /**
     * Check if file is supported
     */
    isSupportedFile(filePath: string): boolean {
        const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
        return supportedExtensions.some(ext => filePath.endsWith(ext));
    }
}
