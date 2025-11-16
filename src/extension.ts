import * as vscode from 'vscode';
import { SelectionRequestParser } from './selection-request-parser';
import { MarkdownEditorResolver } from './editor-resolver';
import { ConfigurationManager } from './configuration';
import { SelectionStrategyFactory } from './selection-strategy-factory';
import { extendMarkdownIt } from './markdown-it-config-plugin';

export function activate(context: vscode.ExtensionContext) {
    const editorResolver = new MarkdownEditorResolver();
    const config = ConfigurationManager.get();
    const strategyFactory = new SelectionStrategyFactory(config.maxSearchLines);

    // Listen for config changes and refresh markdown preview
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('markdownPreviewSelectionSync')) {
                // Refresh all visible markdown previews
                vscode.commands.executeCommand('markdown.preview.refresh');
            }
        })
    );

    // Listen for active editor changes to track the last markdown editor
    // Note: We ignore undefined editors as they can occur during tab switching
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                editorResolver.updateLastEditor(editor);
            }
        })
    );

    // Register URI handler to receive messages from preview
    const uriHandler = vscode.window.registerUriHandler({
        handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
            // Parse query parameters
            const request = SelectionRequestParser.parse(uri);
            if (!request) {
                console.log('[URI Handler] Failed to parse request');
                return;
            }

            const { startLine, endLine, selectedText } = request;

            // Find the markdown editor
            const editor = editorResolver.resolve();
            if (!editor) {
                console.log('[URI Handler] No markdown editor found');
                return;
            }

            console.log('[URI Handler] Found editor:', editor.document.uri.toString());

            // Get appropriate strategy and create selection
            const strategy = strategyFactory.getStrategy(startLine, endLine, selectedText);
            const selection = strategy.select(editor, startLine, endLine, selectedText);

            // Show the document and make the selection
            // Use preserveFocus: true to avoid unloading the preview when in separate tab mode
            vscode.window.showTextDocument(editor.document, {
                viewColumn: editor.viewColumn,
                preserveFocus: true,  // Keep focus on preview to prevent preview reload
                selection: selection
            }).then((newEditor) => {
                console.log(`[URI Handler] Selection updated: ${selection.start.line}:${selection.start.character}-${selection.end.line}:${selection.end.character}`);
                // Update the tracked editor with the new editor instance returned by showTextDocument
                editorResolver.updateLastEditor(newEditor);
            });
        }
    });

    context.subscriptions.push(uriHandler);

    // Return markdown-it plugin for config injection
    return { extendMarkdownIt };
}

export function deactivate() {}
