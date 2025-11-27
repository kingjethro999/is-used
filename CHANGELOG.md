# Changelog

All notable changes to the `is-used` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Auto-fix capabilities with dry-run mode
- Vue.js framework support
- Angular framework support
- Watch mode for development
- ESLint plugin integration
- VS Code extension
- Dependency analysis for package.json
- Dead code detection (unreachable code)
- CI mode with configurable max-issues threshold

---

## [1.0.0] - 2025-11-27

### Added
- **Core Analysis Engine**
  - AST-based parsing using Babel for JavaScript/TypeScript
  - Unused import detection
  - Unused variable detection (const, let, var)
  - Unused function detection (function declarations, arrow functions)
  - Accurate scope tracking and usage analysis
  - Support for JSX/TSX syntax

- **CLI Commands**
  - `check <file>` - Analyze a single file
  - `scan <directory>` - Recursively scan directories
  - `analyze <directory>` - Detailed analysis (alias for scan)
  - Extension filtering support (--extensions flag)
  - JSON output support (--json flag)
  - File output support (--output flag)

- **Framework Support**
  - React-specific analysis
  - Unused React hooks detection (useState, useEffect, useMemo, etc.)
  - JSX element tracking
  - React component identification

- **Reporting**
  - Beautiful terminal output with colors and icons
  - Detailed line-by-line reporting
  - JSON format for CI/CD integration
  - Summary statistics for multiple files
  - Estimated size reduction calculations

- **Configuration System**
  - Support for `is-used.config.js` configuration files
  - Framework-specific presets (React, Vue, Angular)
  - Customizable analysis rules
  - Include/exclude patterns
  - Auto-fix behavior configuration

- **Developer Experience**
  - Zero-config usage with sensible defaults
  - Works with npx (no installation required)
  - Progress indicators with ora spinner
  - Recursive directory scanning with automatic ignore patterns
  - Support for .js, .jsx, .ts, .tsx, .mjs, .cjs files

- **Documentation**
  - Comprehensive README with examples
  - Configuration guide
  - CI/CD integration examples (GitHub Actions, Husky)
  - MIT License
  - Example configuration file

### Technical Details
- Built with TypeScript for type safety
- Uses @babel/parser and @babel/traverse for AST analysis
- Commander.js for CLI argument parsing
- Chalk for terminal colors
- Ora for progress indicators
- Glob for file pattern matching

---

## Version History

### [1.0.0] - Initial Release
**Focus**: Core static analysis for JavaScript/TypeScript with React support

**Key Features**:
- ✅ Unused imports detection
- ✅ Unused variables detection
- ✅ Unused functions detection
- ✅ React hooks analysis
- ✅ CLI with check/scan commands
- ✅ JSON and terminal reporting
- ✅ Configuration system

**Supported Languages**:
- JavaScript (ES5, ES6+)
- TypeScript
- JSX
- TSX

**Supported Frameworks**:
- React (with hooks support)

---

## Future Roadmap

### [1.1.0] - Auto-fix & Enhancements (Planned)
- Auto-fix capabilities
- Dry-run mode
- Safe mode (imports only)
- Backup/restore functionality
- Improved accuracy for edge cases

### [1.2.0] - Vue.js Support (Planned)
- Vue single-file component (.vue) support
- Composition API analysis
- Options API analysis
- Unused computed properties detection
- Unused methods detection

### [1.3.0] - Angular Support (Planned)
- Angular component analysis
- Service and module detection
- Decorator support
- Dependency injection tracking

### [2.0.0] - Advanced Features (Planned)
- Watch mode for real-time analysis
- ESLint plugin
- VS Code extension
- Dependency graph visualization
- Performance optimizations for large codebases
- Multi-threaded analysis

---

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

MIT © [King Jethro](https://github.com/kingjethro999)
