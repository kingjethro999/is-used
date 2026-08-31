import * as fs from 'fs';
import * as path from 'path';
import { TerminalReporter } from '../../reporters/terminal';

interface InitOptions {
    framework?: 'react' | 'vue' | 'none';
}

const CONFIG_TEMPLATES = {
    react: `module.exports = {
    // Files to analyze
    include: ['src/**/*.{js,jsx,ts,tsx}'],

    // Files to ignore
    exclude: ['**/*.test.*', '**/*.spec.*', 'node_modules'],

    // Framework-specific rules
    framework: 'react',

    // Analysis options
    rules: {
        imports: true,
        variables: true,
        functions: true,
        classes: true,
        interfaces: true, // TypeScript
        enums: true,      // TypeScript
        hooks: true,      // React
        props: true,      // React
    },

    // Auto-fix behavior
    fix: {
        imports: true,
        comments: 'preserve', // 'remove' or 'preserve'
        exports: false, // be careful with exports
    }
}
`,
    vue: `module.exports = {
    // Files to analyze
    include: ['src/**/*.{js,ts,vue}'],

    // Files to ignore
    exclude: ['**/*.test.*', '**/*.spec.*', 'node_modules'],

    // Framework-specific rules
    framework: 'vue',

    // Analysis options
    rules: {
        imports: true,
        variables: true,
        functions: true,
        classes: true,
        interfaces: true, // TypeScript
        enums: true,      // TypeScript
        computed: true,   // Vue
        methods: true,    // Vue
        data: true,       // Vue
    },

    // Auto-fix behavior
    fix: {
        imports: true,
        comments: 'preserve', // 'remove' or 'preserve'
        exports: false, // be careful with exports
    }
}
`,
    none: `module.exports = {
    // Files to analyze
    include: ['src/**/*.{js,jsx,ts,tsx}'],

    // Files to ignore
    exclude: ['**/*.test.*', '**/*.spec.*', 'node_modules'],

    // Framework-specific rules (optional)
    // framework: 'react', // 'vue', 'angular', 'svelte'

    // Analysis options
    rules: {
        imports: true,
        variables: true,
        functions: true,
        classes: true,
        interfaces: true, // TypeScript
        enums: true,      // TypeScript
    },

    // Auto-fix behavior
    fix: {
        imports: true,
        comments: 'preserve', // 'remove' or 'preserve'
        exports: false, // be careful with exports
    }
}
`
};

export async function initCommand(options: InitOptions = {}): Promise<void> {
    const reporter = new TerminalReporter();
    const configPath = path.join(process.cwd(), 'is-used.config.js');

    try {
        // Check if config already exists
        if (fs.existsSync(configPath)) {
            reporter.error('is-used.config.js already exists in this directory');
            reporter.info('Remove the existing file or edit it manually');
            process.exit(1);
        }

        // Determine framework
        let framework = options.framework || 'none';

        // If no framework specified, try to detect from package.json
        if (!options.framework) {
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                try {
                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

                    if (deps.react) {
                        framework = 'react';
                        reporter.info('Detected React framework from package.json');
                    } else if (deps.vue) {
                        framework = 'vue';
                        reporter.info('Detected Vue.js framework from package.json');
                    }
                } catch (error) {
                    // Ignore package.json parsing errors
                }
            }
        }

        // Get template
        const template = CONFIG_TEMPLATES[framework as keyof typeof CONFIG_TEMPLATES] || CONFIG_TEMPLATES.none;

        // Write config file
        fs.writeFileSync(configPath, template, 'utf-8');

        reporter.success('Created is-used.config.js');
        reporter.info('');
        reporter.info('Next steps:');
        reporter.info('  1. Review and customize the configuration');
        reporter.info('  2. Run: is-used scan ./src');
        reporter.info('');

        if (framework === 'vue') {
            reporter.info('Vue.js support includes:');
            reporter.info('  - .vue single-file components');
            reporter.info('  - Computed properties analysis');
            reporter.info('  - Methods and data properties');
        } else if (framework === 'react') {
            reporter.info('React support includes:');
            reporter.info('  - JSX/TSX files');
            reporter.info('  - React hooks analysis');
            reporter.info('  - Component props tracking');
        }

    } catch (error) {
        reporter.error(`Failed to create config: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
