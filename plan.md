## **Package Name: `is-used`**

A static analysis tool that detects unused imports, variables, functions, and dependencies in your JavaScript/TypeScript components and pages.

## **What it does:**
- Identifies unused imports and dependencies
- Detects unused variables and functions
- Finds dead code and unreachable components
- Provides cleanup suggestions with auto-fix capability
- Supports multiple frameworks (React, Vue, Angular, etc.)

## **Commands:**

### **1. Basic Usage**
```bash
#Instal globally 
npm i -g is-used

# Scan specific file
npx is-used check ./src/components/Button.js

# Scan entire directory
npx is-used scan ./src

# Scan with specific file extensions
npx is-used scan ./src --extensions js,jsx,ts,tsx,vue
```

### **2. Advanced Analysis**
```bash
# Show detailed report
npx is-used analyze ./src --detailed

# Check for unused dependencies
npx is-used dependencies ./package.json

# Find dead code (unreachable)
npx is-used dead-code ./src --include-nested
```

### **3. Auto-fix Capabilities**
```bash
# Remove unused imports (dry run)
npx is-used fix ./src --dry-run

# Auto-remove unused code
npx is-used fix ./src --auto

# Safe mode (only remove imports)
npx is-used fix ./src --safe
```

### **4. Framework-specific**
```bash
# React components analysis
npx is-used react ./src --hooks --props

# Vue single-file components
npx is-used vue ./src/components --composition-api

# Angular components and services
npx is-used angular ./src/app --modules
```

### **5. Integration & Reporting**
```bash
# Export results
npx is-used scan ./src --output report.json

# CI integration
npx is-used ci ./src --max-issues 10

# Watch mode for development
npx is-used watch ./src --ignore test,spec
```

## **Configuration File:**
```javascript
// is-used.config.js
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
```

## **Example Output:**

### **Terminal Report:**
```
🔍 is-used Analysis Report
────────────────────────────
📁 File: ./src/components/UserCard.js

❌ Unused Imports:
   • { useState } from 'react' (line 1)
   • { formatDate } from '../utils/date' (line 3)
   • UserAvatar from './UserAvatar' (line 5)

❌ Unused Variables:
   • const [isLoading, setIsLoading] = useState(false) (line 8)
   • const userPreferences = props.preferences (line 15)

❌ Unused Functions:
   • function handleClick() { ... } (line 20)

💡 Suggestions:
   • Remove 3 unused imports (save ~2KB)
   • Remove 2 unused variables
   • Remove 1 unused function

✅ Used items preserved:
   • UserCard component
   • userData variable
   • handleSubmit function
```

### **JSON Report:**
```json
{
  "file": "./src/components/UserCard.js",
  "unusedImports": [
    {
      "name": "useState",
      "from": "react",
      "line": 1,
      "fix": "remove"
    }
  ],
  "unusedVariables": [
    {
      "name": "isLoading",
      "type": "const",
      "line": 8,
      "fix": "remove"
    }
  ],
  "savings": {
    "estimatedSizeReduction": "2.1KB",
    "unusedItemsCount": 6
  }
}
```

## **Framework-specific Features:**

### **React:**
```bash
# Check unused hooks and props
npx is-used react ./src --check-hooks --check-props

# Example findings:
# • Unused hook: useMemo on line 15
# • Unused prop: `isVisible` in UserCard
# • Unused context: ThemeContext
```

### **Vue:**
```bash
# Check composition API and options
npx is-used vue ./src --composition --options

# Example findings:
# • Unused computed property: fullName
# • Unused method: handleReset
# • Unused import: ref from vue
```

### **TypeScript:**
```bash
# Check interfaces and types
npx is-used typescript ./src --interfaces --enums

# Example findings:
# • Unused interface: UserPreferences
# • Unused type: ApiResponse
# • Unused enum: StatusCodes
```

## **Integration Examples:**

### **With ESLint:**
```javascript
// .eslintrc.js
module.exports = {
  plugins: ['is-used'],
  rules: {
    'is-used/no-unused-imports': 'warn',
    'is-used/no-unused-variables': 'warn'
  }
}
```

### **With Husky (pre-commit):**
```json
// package.json
{
  "scripts": {
    "pre-commit": "is-used scan src --max-issues 5"
  }
}
```

### **With GitHub Actions:**
```yaml
# .github/workflows/cleanup.yml
- name: Check for unused code
  run: |
    npx is-used ci ./src --max-issues 10
```

## **Key Benefits:**
- **Bundle Size Reduction**: Remove dead code automatically
- **Code Quality**: Keep codebase clean and maintainable
- **Performance**: Smaller bundles = faster loading
- **Developer Experience**: Instant feedback on unused code
- **Safe Refactoring**: Confidence when removing code

This would be incredibly valuable for teams maintaining large codebases where unused code tends to accumulate over time. Want me to help you start implementing the core functionality?