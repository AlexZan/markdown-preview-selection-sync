import * as assert from 'assert';
import * as vscode from 'vscode';
import {
    SingleLineCharacterStrategy,
    MultiLineTextSearchStrategy,
    LineRangeStrategy
} from '../../selection-strategies';

suite('Selection Strategies Test Suite', () => {
    let document: vscode.TextDocument;

    suiteSetup(async () => {
        // Create a test document
        const content = `# Test Document

This is a test paragraph with some text.
It spans multiple lines in the source.
And continues here.

Another paragraph.`;

        document = await vscode.workspace.openTextDocument({
            content: content,
            language: 'markdown'
        });
    });

    suite('SingleLineCharacterStrategy', () => {
        const strategy = new SingleLineCharacterStrategy();

        test('should select exact text within line', () => {
            const editor = { document } as vscode.TextEditor;
            const selection = strategy.select(editor, 2, 2, 'test paragraph');

            assert.strictEqual(selection.start.line, 2);
            assert.strictEqual(selection.start.character, 10);
            assert.strictEqual(selection.end.line, 2);
            assert.strictEqual(selection.end.character, 24);
        });

        test('should select entire line if text not found', () => {
            const editor = { document } as vscode.TextEditor;
            const selection = strategy.select(editor, 2, 2, 'nonexistent text');

            assert.strictEqual(selection.start.line, 2);
            assert.strictEqual(selection.start.character, 0);
            assert.strictEqual(selection.end.line, 2);
            assert.strictEqual(selection.end.character, document.lineAt(2).text.length);
        });
    });

    suite('MultiLineTextSearchStrategy', () => {
        const strategy = new MultiLineTextSearchStrategy(50);

        test('should find end line for multi-line selection', () => {
            const editor = { document } as vscode.TextEditor;
            const selection = strategy.select(
                editor,
                2,
                3,
                'This is a test paragraph with some text. It spans multiple lines'
            );

            assert.strictEqual(selection.start.line, 2);
            assert.strictEqual(selection.start.character, 0);
            assert.strictEqual(selection.end.line, 3);
        });

        test('should respect max search lines limit', () => {
            const limitedStrategy = new MultiLineTextSearchStrategy(2);
            const editor = { document } as vscode.TextEditor;
            const selection = limitedStrategy.select(
                editor,
                2,
                3,
                'text that extends beyond limit'
            );

            // Should not search beyond 2 lines
            assert.ok(selection.end.line <= 4);
        });
    });

    suite('LineRangeStrategy', () => {
        const strategy = new LineRangeStrategy();

        test('should select entire line range', () => {
            const editor = { document } as vscode.TextEditor;
            const selection = strategy.select(editor, 2, 4, '');

            assert.strictEqual(selection.start.line, 2);
            assert.strictEqual(selection.start.character, 0);
            assert.strictEqual(selection.end.line, 4);
            assert.strictEqual(selection.end.character, document.lineAt(4).text.length);
        });

        test('should handle single line range', () => {
            const editor = { document } as vscode.TextEditor;
            const selection = strategy.select(editor, 2, 2, '');

            assert.strictEqual(selection.start.line, 2);
            assert.strictEqual(selection.end.line, 2);
        });
    });
});
