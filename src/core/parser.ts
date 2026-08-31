import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as fs from 'fs';
import { parse as parseVueSFC } from '@vue/compiler-sfc';

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
        let code = fs.readFileSync(filePath, 'utf-8');

        // Handle Vue SFC files
        if (filePath.endsWith('.vue')) {
            const { descriptor } = parseVueSFC(code, { filename: filePath });

            // Extract script content
            if (descriptor.script) {
                code = descriptor.script.content;
            } else if (descriptor.scriptSetup) {
                code = descriptor.scriptSetup.content;
            } else {
                // No script section, return empty AST
                code = '';
            }
        }

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
        const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.vue'];
        return supportedExtensions.some(ext => filePath.endsWith(ext));
    }
}
