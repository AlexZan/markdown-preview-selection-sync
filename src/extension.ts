import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Markdown Preview Selection Sync extension activated');

    // Track the last active markdown editor
    let lastMarkdownEditor: vscode.TextEditor | undefined;

    // Listen for active editor changes to track the last markdown editor
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && editor.document.languageId === 'markdown') {
                lastMarkdownEditor = editor;
                console.log('Tracked markdown editor:', editor.document.fileName);
            }
        })
    );

    // Register URI handler to receive messages from preview
    const uriHandler = vscode.window.registerUriHandler({
        handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
            console.log('URI received:', uri.toString());

            // Parse query parameters
            const query = new URLSearchParams(uri.query);
            const startLine = query.get('startLine');
            const endLine = query.get('endLine');

            if (startLine === null || endLine === null) {
                console.warn('Missing startLine or endLine parameters');
                return;
            }

            const start = parseInt(startLine, 10);
            const end = parseInt(endLine, 10);

            if (isNaN(start) || isNaN(end)) {
                console.warn('Invalid line numbers:', startLine, endLine);
                return;
            }

            // Find the markdown editor - it might not be "active" if preview has focus
            let editor = vscode.window.activeTextEditor;

            // If no active editor or it's not markdown, search all visible editors
            if (!editor || editor.document.languageId !== 'markdown') {
                // First, check if we have a tracked markdown editor (even if not visible)
                if (lastMarkdownEditor) {
                    editor = lastMarkdownEditor;
                    console.log('Using tracked markdown editor:', editor.document.fileName);
                } else {
                    // Fall back to searching visible editors
                    const markdownEditors = vscode.window.visibleTextEditors.filter(
                        e => e.document.languageId === 'markdown'
                    );

                    if (markdownEditors.length === 0) {
                        console.warn('No markdown editor found');
                        return;
                    }

                    if (markdownEditors.length === 1) {
                        // Only one markdown editor, use it
                        editor = markdownEditors[0];
                    } else {
                        // Multiple markdown editors - try to find the right one
                        // Use the activeTextEditor if available, even if it's not currently focused
                        editor = markdownEditors.find(e => e === vscode.window.activeTextEditor) || markdownEditors[0];
                    }
                    console.log('Using markdown editor:', editor.document.fileName);
                }
            }

            // data-line attributes are already 0-indexed, use them directly
            const startPos = new vscode.Position(start, 0);
            const endPos = new vscode.Position(end, editor.document.lineAt(end).text.length);

            // Create selection and reveal it
            const selection = new vscode.Selection(startPos, endPos);

            // Store the current active editor/group before switching
            const currentActiveEditor = vscode.window.activeTextEditor;

            // Show the document and make the selection
            vscode.window.showTextDocument(editor.document, {
                viewColumn: editor.viewColumn,
                preserveFocus: false, // Give focus to trigger selection events
                selection: selection
            }).then(() => {
                console.log(`Updated selection: lines ${start}-${end}`);
            });
        }
    });

    context.subscriptions.push(uriHandler);
}

export function deactivate() {}
