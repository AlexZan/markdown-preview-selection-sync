import * as assert from 'assert';
import * as vscode from 'vscode';
import { SelectionRequestParser } from '../../selection-request-parser';

suite('SelectionRequestParser Test Suite', () => {
    test('should parse valid URI with all parameters', () => {
        const uri = vscode.Uri.parse(
            'vscode://test?startLine=5&endLine=10&text=hello%20world&startOffset=2&endOffset=15'
        );

        const request = SelectionRequestParser.parse(uri);

        assert.ok(request);
        assert.strictEqual(request!.startLine, 5);
        assert.strictEqual(request!.endLine, 10);
        assert.strictEqual(request!.selectedText, 'hello world');
        assert.strictEqual(request!.startOffset, 2);
        assert.strictEqual(request!.endOffset, 15);
    });

    test('should parse URI with missing optional parameters', () => {
        const uri = vscode.Uri.parse('vscode://test?startLine=3&endLine=7&text=sample');

        const request = SelectionRequestParser.parse(uri);

        assert.ok(request);
        assert.strictEqual(request!.startLine, 3);
        assert.strictEqual(request!.endLine, 7);
        assert.strictEqual(request!.selectedText, 'sample');
        assert.strictEqual(request!.startOffset, undefined);
        assert.strictEqual(request!.endOffset, undefined);
    });

    test('should return null for missing startLine', () => {
        const uri = vscode.Uri.parse('vscode://test?endLine=10&text=hello');

        const request = SelectionRequestParser.parse(uri);

        assert.strictEqual(request, null);
    });

    test('should return null for missing endLine', () => {
        const uri = vscode.Uri.parse('vscode://test?startLine=5&text=hello');

        const request = SelectionRequestParser.parse(uri);

        assert.strictEqual(request, null);
    });

    test('should return null for invalid line numbers', () => {
        const uri = vscode.Uri.parse('vscode://test?startLine=abc&endLine=xyz&text=hello');

        const request = SelectionRequestParser.parse(uri);

        assert.strictEqual(request, null);
    });

    test('should handle empty text parameter', () => {
        const uri = vscode.Uri.parse('vscode://test?startLine=1&endLine=2&text=');

        const request = SelectionRequestParser.parse(uri);

        assert.ok(request);
        assert.strictEqual(request!.selectedText, '');
    });

    test('should handle missing text parameter', () => {
        const uri = vscode.Uri.parse('vscode://test?startLine=1&endLine=2');

        const request = SelectionRequestParser.parse(uri);

        assert.ok(request);
        assert.strictEqual(request!.selectedText, '');
    });
});
