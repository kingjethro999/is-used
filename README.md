# is-used

[![npm version](https://badge.fury.io/js/is-used.svg)](https://www.npmjs.com/package/is-used)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful static analysis tool that detects unused imports, variables, functions, and dependencies in your JavaScript/TypeScript projects.

## Features

✨ **Comprehensive Analysis**
- Detects unused imports, variables, and functions
- Supports JavaScript, TypeScript, JSX, and TSX
- Framework-specific support for React (hooks, props)
- Accurate scope tracking and usage detection

🎯 **Developer Friendly**
- Beautiful terminal output with colors and icons
- JSON output for CI/CD integration
- Fast recursive directory scanning
- Configurable rules and presets

🚀 **Easy to Use**
- Zero configuration required
- Works with `npx` - no installation needed
- Supports multiple file extensions
- Detailed reporting with line numbers

## Installation

### Use with npx (Recommended)

```bash
npx is-used check ./src/components/Button.js
```

### Install Globally

```bash
npm install -g is-used
```

### Install as Dev Dependency

```bash
npm install --save-dev is-used
```

## Usage

### Basic Commands

#### Check a Single File

```bash
npx is-used check ./src/components/Button.js
```

#### Scan a Directory

```bash
npx is-used scan ./src
```

#### Scan with Specific Extensions

```bash
npx is-used scan ./src --extensions js,jsx,ts,tsx
```

#### Detailed Analysis

```bash
npx is-used analyze ./src --output report.json
```

### Command Options

#### `check <file>`

Analyze a specific file for unused code.

**Options:**
- `-o, --output <path>` - Save report to file (JSON format)
- `-j, --json` - Output results as JSON

**Example:**
```bash
npx is-used check ./src/App.tsx --output report.json
```

#### `scan <directory>`

Scan a directory recursively for unused code.

**Options:**
- `-e, --extensions <extensions>` - File extensions to include (default: js,jsx,ts,tsx)
- `-o, --output <path>` - Save report to file (JSON format)
- `-j, --json` - Output results as JSON

**Example:**
```bash
npx is-used scan ./src --extensions ts,tsx --output analysis.json
```

#### `analyze <directory>`

Perform detailed analysis (alias for scan with detailed output).

**Options:**
- Same as `scan` command

## Configuration

Create a `is-used.config.js` file in your project root:

```javascript
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
  },
  
  // Auto-fix behavior
  fix: {
    imports: true,
    comments: 'preserve', // 'remove' or 'preserve'
    exports: false, // be careful with exports
  }
}
```

## Example Output

### Terminal Output

```
🔍 is-used Analysis Report
──────────────────────────────────────────────────

📁 File: ./src/components/UserCard.js

❌ Unused Imports:
   • { useState } from 'react' (line 1)
   • { formatDate } from '../utils/date' (line 3)

❌ Unused Variables:
   • const isLoading (line 8)
   • const userPreferences (line 15)

❌ Unused Functions:
   • function handleClick (line 20)

💡 Suggestions:
   • Remove 2 unused imports
   • Remove 2 unused variables
   • Remove 1 unused function
   • Estimated size reduction: 2.5KB

📊 Summary
──────────────────────────────────────────────────
Files analyzed: 1
Total unused items: 5
```

### JSON Output

```json
{
  "timestamp": "2025-11-27T19:00:00.000Z",
  "filesAnalyzed": 1,
  "results": [
    {
      "file": "./src/components/UserCard.js",
      "unusedImports": [
        {
          "name": "useState",
          "from": "react",
          "line": 1,
          "column": 9,
          "fix": "remove"
        }
      ],
      "unusedVariables": [
        {
          "name": "isLoading",
          "type": "const",
          "line": 8,
          "column": 6,
          "fix": "remove"
        }
      ],
      "unusedFunctions": [],
      "usedItems": [],
      "savings": {
        "estimatedSizeReduction": "2.5KB",
        "unusedItemsCount": 5
      }
    }
  ],
  "summary": {
    "totalUnusedImports": 2,
    "totalUnusedVariables": 2,
    "totalUnusedFunctions": 1,
    "totalUnusedItems": 5,
    "filesWithIssues": 1
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Check Unused Code

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx is-used scan ./src --output report.json
```

### Pre-commit Hook (Husky)

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npx is-used scan src"
    }
  }
}
```

## Supported Languages

- ✅ JavaScript (ES5, ES6+)
- ✅ TypeScript
- ✅ JSX
- ✅ TSX
- ✅ React (with hooks support)

## Roadmap

- [ ] Auto-fix capabilities
- [ ] Vue.js support
- [ ] Angular support
- [ ] Watch mode
- [ ] ESLint plugin
- [ ] VS Code extension

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [King Jethro](https://github.com/kingjethro999)

## Author

**King Jethro**
- GitHub: [@kingjethro999](https://github.com/kingjethro999)

## Support

If you find this tool helpful, please give it a ⭐️ on [GitHub](https://github.com/kingjethro999/is-used)!
