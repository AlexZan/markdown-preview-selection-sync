# Development Instructions: Markdown Preview Selection Sync

## Project Overview

A VS Code extension that synchronizes text selection from Markdown preview to the source editor. When users select text in the rendered preview, the extension automatically selects the corresponding lines in the source markdown file.

**Use Case:** Makes it easier to reference specific content in markdown files when working with AI assistants like Claude Code, which can see editor selections but not preview selections.

---

## Architecture

### Communication Flow

```
[Preview Webview]
    ↓ User selects text
    ↓ JavaScript detects selection
    ↓ Finds data-line attributes in DOM
    ↓ Calculates line range
    ↓ Triggers URI: vscode://publisher.extension?startLine=X&endLine=Y
    ↓
[Extension]
    ↓ URI handler receives message
    ↓ Parses line numbers
    ↓ Updates editor.selection
    ↓ Reveals selection in editor
```

### Key Technical Points

1. **Preview Script** (`media/preview-selection.js`)
   - Injected via `markdown.previewScripts` contribution point
   - Listens to `document.selectionchange` events
   - Traverses DOM to find `data-line` attributes (already present in VS Code's markdown preview)
   - Constructs URI with line range and triggers navigation

2. **Extension Code** (`src/extension.ts`)
   - Registers URI handler via `vscode.window.registerUriHandler()`
   - Receives line numbers from URI query parameters
   - Updates active editor's selection using `editor.selection = new vscode.Selection(...)`

3. **IPC Mechanism**
   - Uses URI handlers (standard VS Code IPC pattern)
   - Preview creates hidden anchor element with `vscode://` scheme
   - Programmatic click triggers URI navigation
   - Extension receives and processes the URI

---

## Implementation Steps

### 1. Complete the Preview Script

File: `media/preview-selection.js`

**Requirements:**
- Listen to `selectionchange` events on the document
- Implement debouncing (200-300ms) to avoid excessive triggers
- When selection changes:
  1. Get the selection range using `window.getSelection().getRangeAt(0)`
  2. Traverse DOM to find all elements with `data-line` attributes within/overlapping the selection
  3. Collect unique line numbers and sort them
  4. Use first and last line numbers as the range
  5. Construct URI: `vscode://alexzanfir.markdown-preview-selection-sync?startLine=X&endLine=Y`
  6. Create hidden anchor element, set href to URI, click it, remove it
- Handle edge cases:
  - Empty/collapsed selections (ignore)
  - Selections with no data-line attributes (log warning)
  - Text nodes vs element nodes (handle both)
- Listen to `vscode.markdown.updateContent` event to reset state when preview refreshes

**DOM Traversal Strategy:**
- `data-line` attributes are added by markdown-it plugins during rendering
- Each rendered element (paragraphs, headings, list items, etc.) has `data-line="N"` where N is the source line number (1-indexed)
- Selection range may span multiple elements
- Need to find the lowest and highest line numbers within the selection

**Testing Approach:**
- Add extensive `console.log()` statements
- Test with selections spanning:
  - Single paragraph
  - Multiple paragraphs
  - Across headings and content
  - Lists and code blocks
  - Edge of document

### 2. Extension Code is Already Implemented

File: `src/extension.ts`

**What it does:**
- Activates on markdown language
- Registers URI handler
- Parses `startLine` and `endLine` from query parameters
- Converts from 1-indexed (markdown line numbers) to 0-indexed (VS Code API)
- Creates selection from start of startLine to end of endLine
- Reveals selection in editor viewport

**No changes needed** - this part is complete.

### 3. Create Test Markdown File

File: `test/sample.md`

Create a substantial markdown file for testing:

```markdown
# Test Document for Selection Sync

This is paragraph one with some text.

## Section Two

This is paragraph two with more content.

### Subsection

- List item one
- List item two
- List item three

Another paragraph here.

## Section Three

```javascript
function test() {
  console.log("code block");
}
```

Final paragraph at the end.
```

**Testing Instructions:**
1. Open `sample.md` in VS Code
2. Open markdown preview side-by-side (Ctrl+K V)
3. Select text in the preview (single paragraph, multiple paragraphs, across sections)
4. Observe:
   - Editor selection updates automatically
   - Correct lines are selected
   - Selection is visible (scrolls into view if needed)
5. Check browser console (Help → Toggle Developer Tools) for debug logs

### 4. Build and Run

**Setup:**
```bash
npm install
npm run compile
```

**Run Extension (Development Host):**
1. Press F5 in VS Code (or use "Run Extension" launch config)
2. New VS Code window opens with extension loaded
3. Open test markdown file
4. Open preview side-by-side
5. Test selection synchronization

**Debug:**
- Extension logs: Debug Console in development VS Code instance
- Preview script logs: Help → Toggle Developer Tools → Console (in extension host window)

### 5. Package for Distribution

```bash
npm install -g @vscode/vsce
vsce package
```

This creates a `.vsix` file that can be installed locally or published to the marketplace.

---

## Testing Checklist

- [ ] Single line selection works
- [ ] Multi-line selection works
- [ ] Selection across different element types (headings, paragraphs, lists, code blocks)
- [ ] Selection at start of document
- [ ] Selection at end of document
- [ ] Rapid selection changes don't cause issues (debouncing works)
- [ ] Preview refresh resets state properly
- [ ] No selection (collapsed) doesn't trigger URI
- [ ] Works with multiple markdown files open
- [ ] Doesn't interfere with non-markdown files
- [ ] Console logs provide clear debugging information

---

## Known Limitations

1. **Line granularity only** - Selects entire lines, not character-precise ranges (acceptable for AI assistant use case)
2. **Requires data-line attributes** - Won't work if markdown-it plugins don't add these (VS Code's default does)
3. **Preview-to-editor only** - Doesn't sync editor selection back to preview (not needed for use case)
4. **Single markdown file** - Assumes preview corresponds to active editor (VS Code handles this)

---

## Future Enhancements

- Add configuration option to disable/enable the extension
- Add visual feedback in preview when selection is synced
- Support character-level precision (more complex DOM traversal)
- Add keyboard shortcut to manually trigger sync
- Support syncing from editor to preview (highlight in preview)

---

## Resources

- [VS Code Extension API - Markdown Extension](https://code.visualstudio.com/api/extension-guides/markdown-extension)
- [VS Code Extension API - URI Handler](https://code.visualstudio.com/api/references/vscode-api#window.registerUriHandler)
- [MDN - Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
- [MDN - Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range)

---

## Acceptance Criteria for UAT

Before presenting to user for User Acceptance Testing:

1. **Core functionality works:**
   - Selecting text in preview immediately selects corresponding lines in editor
   - Selection is visible and scrolled into view

2. **No console errors:**
   - Extension activates without errors
   - Preview script loads without errors
   - URI handling works cleanly

3. **Edge cases handled:**
   - Empty selections don't break anything
   - Preview refresh doesn't break functionality
   - Multiple rapid selections work smoothly

4. **Documentation complete:**
   - README.md explains what the extension does
   - DEV_INSTRUCTIONS.md (this file) provides clear implementation guidance
   - Code has comments explaining non-obvious logic

5. **Ready to install and test:**
   - `npm install && npm run compile` works
   - F5 launches extension host successfully
   - Test markdown file is available
