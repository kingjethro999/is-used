import * as fs from 'fs';
import * as path from 'path';
import { ConfigFile } from '../reporters/types';
import { defaultConfig } from './defaults';

export class ConfigLoader {
    /**
     * Load configuration from file or use defaults
     */
    loadConfig(configPath?: string): ConfigFile {
        if (configPath) {
            return this.loadFromFile(configPath);
        }

        // Try to find config in current directory
        const possiblePaths = [
            'is-used.config.js',
            'is-used.config.json',
            '.isusedrc.js',
            '.isusedrc.json',
        ];

        for (const possiblePath of possiblePaths) {
            const fullPath = path.resolve(process.cwd(), possiblePath);
            if (fs.existsSync(fullPath)) {
                return this.loadFromFile(fullPath);
            }
        }

        // Return default config
        return defaultConfig;
    }

    /**
     * Load configuration from specific file
     */
    private loadFromFile(filePath: string): ConfigFile {
        const absolutePath = path.resolve(process.cwd(), filePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Config file not found: ${filePath}`);
        }

        try {
            // Clear require cache to allow reloading
            delete require.cache[require.resolve(absolutePath)];

            const userConfig = require(absolutePath);

            // Merge with defaults
            return this.mergeConfig(defaultConfig, userConfig);
        } catch (error) {
            throw new Error(`Failed to load config: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Merge user config with defaults
     */
    private mergeConfig(defaults: ConfigFile, userConfig: Partial<ConfigFile>): ConfigFile {
        return {
            ...defaults,
            ...userConfig,
            rules: {
                ...defaults.rules,
                ...(userConfig.rules || {}),
            },
            fix: userConfig.fix ? {
                ...(defaults.fix || {}),
                ...userConfig.fix,
            } : defaults.fix,
        };
    }
}
