# Change Log

All notable changes to the "Markdown Preview Selection Sync" extension will be documented in this file.

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

### Known Issues
- Block-level granularity only (selecting text within a paragraph selects the entire paragraph) - See [Issue #1](https://github.com/AlexZan/markdown-preview-selection-sync/issues/1)
- Markdown files only (no support for other preview types)

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
