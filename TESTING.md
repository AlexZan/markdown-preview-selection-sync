# Testing Guide

## Quick Start

1. **Launch Extension**: Press `F5` to launch the Extension Development Host
2. **Open Test File**: In the new VS Code window, open `test/sample.md`
3. **Open Preview**: Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac) to open the preview pane
4. **Arrange Windows**: Place the source editor and preview side-by-side

## Test Scenarios

### Basic Functionality

1. **Single Line Selection**
   - Select a single line of text in the preview
   - Verify the corresponding line is selected in the source editor
   - Check that the editor scrolls to show the selection

2. **Multi-Line Selection**
   - Select multiple consecutive lines in the preview
   - Verify all corresponding lines are selected in the source editor

3. **Different Element Types**
   - Select text in headers
   - Select text in lists (ordered and unordered)
   - Select text in code blocks
   - Select text in blockquotes
   - Select text in tables

### Edge Cases

4. **Cross-Element Selection**
   - Select text that spans from one element type to another
   - Verify the selection captures all lines involved

5. **Rapid Selection Changes**
   - Quickly select different parts of the document
   - Verify debouncing works (no excessive updates)
   - Check that the final selection is accurate

6. **Preview Refresh**
   - Make a change to the markdown file
   - Wait for preview to update
   - Try selecting text again
   - Verify selection sync still works

7. **Empty/Collapsed Selection**
   - Click in the preview without selecting text
   - Verify no selection is made in the editor (no errors)

## Debugging

### Check Console Output

Open the Debug Console in VS Code to see log messages:
- "Markdown Preview Selection Sync extension activated" on startup
- "URI received: ..." when selections are made
- "Updated selection: lines X-Y" when successful
- Warning messages if something goes wrong

### Common Issues

**Selection not syncing:**
- Check that the markdown file is the active editor
- Verify the preview script is loading (check Developer Tools in the preview)
- Look for errors in the Debug Console

**Wrong lines selected:**
- Verify the preview has `data-line` attributes on elements
- Check if line numbers are 1-indexed in the URI but 0-indexed in VS Code

**Excessive updates:**
- Check debounce timing (currently 250ms)
- Look for rapid console messages

## Development Tools

### Preview Developer Tools

To debug the preview script:
1. With the preview focused, press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
2. Run command: "Developer: Open Webview Developer Tools"
3. Check the Console for JavaScript errors
4. Inspect the DOM to verify `data-line` attributes exist

### Extension Host Logs

All extension logs appear in the Debug Console of the main VS Code window (not the Extension Development Host).
