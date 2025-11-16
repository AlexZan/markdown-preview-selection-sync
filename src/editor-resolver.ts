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
            console.log('[EditorResolver] Updating lastMarkdownEditor to:', editor.document.uri.toString());
            this.lastMarkdownEditor = editor;
        } else if (editor) {
            console.log('[EditorResolver] Ignoring non-markdown editor:', editor.document.languageId);
        } else {
            console.log('[EditorResolver] updateLastEditor called with undefined');
        }
    }

    /**
     * Resolves the markdown editor to use for selection.
     * Simply uses the last tracked markdown editor.
     * The editor is updated whenever activeTextEditor changes to a markdown file.
     */
    resolve(): vscode.TextEditor | undefined {
        console.log('[EditorResolver] resolve() called');

        // Use the last tracked markdown editor
        // This works even when preview is in a separate tab
        if (this.lastMarkdownEditor) {
            console.log('[EditorResolver] Using lastMarkdownEditor:', this.lastMarkdownEditor.document.uri.toString());
            console.log('[EditorResolver] Editor viewColumn:', this.lastMarkdownEditor.viewColumn);
            console.log('[EditorResolver] Document isClosed:', this.lastMarkdownEditor.document.isClosed);
            return this.lastMarkdownEditor;
        }

        console.log('[EditorResolver] No lastMarkdownEditor, checking active editor');

        // Fallback: Check active editor
        const active = vscode.window.activeTextEditor;
        if (active && active.document.languageId === 'markdown') {
            console.log('[EditorResolver] Found active markdown editor:', active.document.uri.toString());
            this.lastMarkdownEditor = active;
            return active;
        }

        console.log('[EditorResolver] Active editor is not markdown, searching visible editors');

        // Last resort: Search visible markdown editors
        const markdownEditors = vscode.window.visibleTextEditors.filter(
            e => e.document.languageId === 'markdown'
        );

        console.log('[EditorResolver] Found', markdownEditors.length, 'visible markdown editors');

        if (markdownEditors.length > 0) {
            console.log('[EditorResolver] Using first visible markdown editor:', markdownEditors[0].document.uri.toString());
            this.lastMarkdownEditor = markdownEditors[0];
            return markdownEditors[0];
        }

        console.log('[EditorResolver] No markdown editor found anywhere');
        return undefined;
    }
}
