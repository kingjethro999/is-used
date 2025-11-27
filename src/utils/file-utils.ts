import * as fs from 'fs';
import * as path from 'path';

export class FileUtils {
    /**
     * Check if path exists
     */
    static exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    /**
     * Check if path is a file
     */
    static isFile(filePath: string): boolean {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    }

    /**
     * Check if path is a directory
     */
    static isDirectory(filePath: string): boolean {
        return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
    }

    /**
     * Get all files in directory recursively
     */
    static getFilesRecursively(dirPath: string, extensions?: string[]): string[] {
        const files: string[] = [];

        const items = fs.readdirSync(dirPath);

        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip node_modules and common ignore patterns
                if (!['node_modules', '.git', 'dist', 'build', 'coverage'].includes(item)) {
                    files.push(...this.getFilesRecursively(fullPath, extensions));
                }
            } else if (stat.isFile()) {
                if (!extensions || extensions.some(ext => fullPath.endsWith(ext))) {
                    files.push(fullPath);
                }
            }
        });

        return files;
    }

    /**
     * Normalize file extensions
     */
    static normalizeExtensions(extensions: string[]): string[] {
        return extensions.map(ext => ext.startsWith('.') ? ext : `.${ext}`);
    }

    /**
     * Get relative path from cwd
     */
    static getRelativePath(filePath: string): string {
        return path.relative(process.cwd(), filePath);
    }
}
