# Change Log

All notable changes to the "Markdown Preview Selection Sync" extension will be documented in this file.

## [1.0.0] - 2025-11-16

### Added
- **Configuration Options**: Three new configurable settings
  - `requireModifierKey`: Optionally require holding a modifier key to trigger sync
  - `modifierKey`: Choose which key (Ctrl/Alt/Meta) when modifier is required
  - `maxSearchLines`: Configure search range for multi-line selections
- **Character-Level Precision**: Fuzzy text-based search for accurate selection within paragraphs (fixes #1)
- **Modifier Key Support**: Enable Ctrl+Click (or Alt/Cmd+Click) to activate selection sync (fixes #2)
- **Automatic Config Injection**: Settings automatically sync to preview via markdown-it plugin
- **Comprehensive Test Infrastructure**: Added unit tests for all selection strategies
- **Enhanced Architecture**: Refactored into modular, testable components

### Fixed
- **Separate Preview Mode Bug**: Selection sync now works reliably in separate tab mode (fixes #3)
  - Implemented sessionStorage caching for config persistence across webview reloads
  - Fixed config loss when VS Code destroys/recreates preview webviews
- **Multi-Line Selection**: Improved selection precision within paragraph blocks
- **Editor Tracking**: Better handling of undefined editors during tab switching

### Changed
- **Selection Strategy**: Now uses multiple strategies (line-based → text-based fallback) for better accuracy
- **Preview Focus**: Uses `preserveFocus: true` to reduce unnecessary preview reloads

## [0.1.0] - 2025-01-12

### Added
- Initial release
- Automatic selection sync from markdown preview to source editor
- Support for multiple markdown files and preview tabs
- Block-level selection granularity using VS Code's `data-line` attributes
- URI handler-based communication between preview and extension
- Mouseup event detection for final selection capture

### Fixed
- Preview loading issues by removing unnecessary `acquireVsCodeApi()` call
- Multi-file support through `lastMarkdownEditor` tracking
- Selection event triggering for compatibility with AI assistants (Claude Code, etc.)

---

## Future Plans

### [0.2.0] - Planned
- Character-level selection precision
- Configuration options (enable/disable, debounce delay)
- Visual feedback in preview when selection is synced

### [0.3.0] - Planned
- Bi-directional sync (editor → preview highlighting)
- Support for other preview types (HTML, etc.)

---

**Note**: This extension follows [Semantic Versioning](https://semver.org/).
