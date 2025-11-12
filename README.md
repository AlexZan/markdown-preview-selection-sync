# Markdown Preview Selection Sync

VS Code extension that synchronizes text selection from Markdown preview to the source editor.

## What It Does

When you select text in the Markdown preview, this extension automatically selects the corresponding lines in the source markdown file.

**Why?** Makes it easier to reference specific markdown content when working with AI assistants like Claude Code, which can see editor selections but not preview selections.

## How It Works

1. You select text in the rendered Markdown preview
2. Extension detects the selection
3. Extension finds the corresponding source lines using `data-line` attributes
4. Extension updates the editor selection to match
5. Editor scrolls to show the selected lines

## Architecture

- **Preview Script:** Detects selections in the preview webview
- **URI Handler:** Communicates line ranges from preview to extension
- **Selection Update:** Updates editor selection based on line range

Uses standard VS Code IPC mechanism (URI handlers) to communicate across the security boundary between preview webview and extension host.

## Development Status

**Current:** Initial scaffold created, extension code complete, preview script needs implementation.

See [DEV_INSTRUCTIONS.md](DEV_INSTRUCTIONS.md) for complete implementation guide.

## Installation (When Complete)

1. Clone repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 to launch extension in development mode
5. Test with markdown files and preview

## Usage

1. Open a markdown file
2. Open preview side-by-side (Ctrl+K V or Cmd+K V)
3. Select text in the preview
4. Watch the editor selection update automatically

## Technical Details

- Uses `markdown.previewScripts` to inject selection detection
- Uses `data-line` attributes (already present in VS Code's markdown preview)
- Communicates via `vscode://` URI scheme
- Updates selection using VS Code Extension API

## License

MIT

## Author

Alexander Zanfir
