# Markdown Preview Selection Sync

**Automatically sync text selection from Markdown preview to your source editor.**

## Why Use This?

When working with AI assistants like Claude Code, Copilot, or other tools that read your editor selection, you often want to reference specific content from your markdown preview. This extension bridges that gap by automatically selecting the corresponding source lines when you select text in the preview.

## Features

- ✨ **Automatic Selection Sync**: Select text in the preview, see it selected in the source
- 🎯 **Block-Level Precision**: Selects the corresponding lines in your markdown source
- 🚀 **Zero Configuration**: Works out of the box with VS Code's markdown preview
- 🔄 **Multi-File Support**: Handles multiple markdown files and preview tabs
- ⚡ **Lightweight**: Minimal performance impact, no external dependencies

## How It Works

1. Open a markdown file and its preview:
   - **Side-by-side**: Ctrl+K V or Cmd+K V (preview opens in split editor)
   - **Separate tab**: Alt+Click on preview icon (preview opens in new tab)
2. Select any text in the preview by clicking and dragging
3. Release the mouse button
4. The extension automatically selects the corresponding lines in your source editor
5. Your cursor moves to the source editor with the selection highlighted

**Works with both preview modes:**
- ✅ Side-by-side preview (split editor group)
- ✅ Separate tab preview (dedicated preview tab)

## Use Cases

- **AI Assistants**: Quickly reference preview content when chatting with Claude, Copilot, or other AI tools
- **Content Review**: Easily jump to source lines while reviewing rendered content
- **Documentation**: Navigate between preview and source while editing docs
- **Collaboration**: Point team members to specific content during reviews

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Markdown Preview Selection Sync"
4. Click Install

## Extension Settings

This extension currently has no configurable settings. It works automatically when you open markdown files.


## Contributing

Contributions are welcome! Please see the [Development Instructions](https://github.com/AlexZan/markdown-preview-selection-sync/blob/master/DEV_INSTRUCTIONS.md) for setup and development workflow.

## License

MIT - See [LICENSE](LICENSE) file for details

## Author

**Alexander Zanfir**

- GitHub: [@AlexZan](https://github.com/AlexZan)


---

**Enjoy using Markdown Preview Selection Sync!** If you find it useful, please leave a rating on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=alexzanfir.markdown-preview-selection-sync).
