import * as vscode from 'vscode';

/**
 * Resolves the appropriate markdown editor to use for selection sync.
 * Maintains a reference to the last active markdown editor to handle
 * cases where the preview has focus but we need to select in the source.
 */
export class MarkdownEditorResolver {
    private lastMarkdownEditor?: vscode.TextEditor;

    /**
     * Updates the tracked editor when the active editor changes.
     */
    updateLastEditor(editor: vscode.TextEditor | undefined): void {
        if (editor && editor.document.languageId === 'markdown') {
            this.lastMarkdownEditor = editor;
        }
    }

    /**
     * Resolves the markdown editor to use for selection.
     * Uses a three-tier fallback strategy:
     * 1. Tracked editor (even if not currently visible)
     * 2. Active editor (if it's markdown)
     * 3. First visible markdown editor
     */
    resolve(): vscode.TextEditor | undefined {
        // Priority 1: Use tracked editor (even if not visible)
        if (this.lastMarkdownEditor) {
            return this.lastMarkdownEditor;
        }

        // Priority 2: Check active editor
        const active = vscode.window.activeTextEditor;
        if (active && active.document.languageId === 'markdown') {
            return active;
        }

        // Priority 3: Search visible editors
        const markdownEditors = vscode.window.visibleTextEditors.filter(
            e => e.document.languageId === 'markdown'
        );

        return markdownEditors[0];
    }
}
