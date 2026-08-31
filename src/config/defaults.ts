import { ConfigFile } from '../reporters/types';

export const defaultConfig: ConfigFile = {
    include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
    exclude: [
        '**/*.test.*',
        '**/*.spec.*',
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
    ],
    framework: 'react',
    rules: {
        imports: true,
        variables: true,
        functions: true,
        classes: true,
        interfaces: true,
        enums: true,
        hooks: true,
        props: true,
        computed: false,
    },
    fix: {
        imports: true,
        comments: 'preserve',
        exports: false,
    },
};

export const reactPreset: Partial<ConfigFile> = {
    framework: 'react',
    rules: {
        imports: true,
        variables: true,
        functions: true,
        classes: true,
        interfaces: true,
        enums: true,
        hooks: true,
        props: true,
    },
};

export const vuePreset: Partial<ConfigFile> = {
    framework: 'vue',
    rules: {
        imports: true,
        variables: true,
        functions: true,
        classes: true,
        interfaces: true,
        enums: true,
        computed: true,
        methods: true,
        data: true,
    },
};

export const angularPreset: Partial<ConfigFile> = {
    framework: 'angular',
    rules: {
        imports: true,
        variables: true,
        functions: true,
        classes: true,
        interfaces: true,
        enums: true,
    },
};
