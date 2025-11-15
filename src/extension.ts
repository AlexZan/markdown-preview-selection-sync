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

    // Listen for active editor changes to track the last markdown editor
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            editorResolver.updateLastEditor(editor);
        })
    );

    // Register URI handler to receive messages from preview
    const uriHandler = vscode.window.registerUriHandler({
        handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
            // Parse query parameters
            const request = SelectionRequestParser.parse(uri);
            if (!request) {
                return;
            }

            const { startLine, endLine, selectedText } = request;

            // Find the markdown editor
            const editor = editorResolver.resolve();
            if (!editor) {
                return;
            }

            // Get appropriate strategy and create selection
            const strategy = strategyFactory.getStrategy(startLine, endLine, selectedText);
            const selection = strategy.select(editor, startLine, endLine, selectedText);

            // Show the document and make the selection
            vscode.window.showTextDocument(editor.document, {
                viewColumn: editor.viewColumn,
                preserveFocus: false,
                selection: selection
            }).then(() => {
                console.log(`Updated selection: ${selection.start.line}:${selection.start.character}-${selection.end.line}:${selection.end.character}`);
            });
        }
    });

    context.subscriptions.push(uriHandler);

    // Return markdown-it plugin for config injection
    return { extendMarkdownIt };
}

export function deactivate() {}
