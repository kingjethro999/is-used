module.exports = {
    // Files to analyze
    include: ['src/**/*.{js,jsx,ts,tsx}'],

    // Files to ignore
    exclude: ['**/*.test.*', '**/*.spec.*', 'node_modules'],

    // Framework-specific rules
    framework: 'react', // 'vue', 'angular', 'svelte'

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
        computed: true,   // Vue
    },

    // Auto-fix behavior
    fix: {
        imports: true,
        comments: 'preserve', // 'remove' or 'preserve'
        exports: false, // be careful with exports
    }
}
