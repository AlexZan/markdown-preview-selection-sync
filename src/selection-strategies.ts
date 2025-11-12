import * as vscode from 'vscode';

/**
 * Strategy interface for different selection modes.
 */
export interface SelectionStrategy {
    select(
        editor: vscode.TextEditor,
        startLine: number,
        endLine: number,
        selectedText: string
    ): vscode.Selection;
}

/**
 * Strategy for single-line selections with character-level precision.
 * Uses indexOf to find the exact character position of the selected text.
 */
export class SingleLineCharacterStrategy implements SelectionStrategy {
    select(
        editor: vscode.TextEditor,
        startLine: number,
        endLine: number,
        selectedText: string
    ): vscode.Selection {
        const lineText = editor.document.lineAt(startLine).text;
        const selectionIndex = lineText.indexOf(selectedText);

        if (selectionIndex !== -1) {
            // Found exact match - use character positions
            const startPos = new vscode.Position(startLine, selectionIndex);
            const endPos = new vscode.Position(startLine, selectionIndex + selectedText.length);
            return new vscode.Selection(startPos, endPos);
        }

        // Fallback: select entire line
        const startPos = new vscode.Position(startLine, 0);
        const endPos = new vscode.Position(startLine, lineText.length);
        return new vscode.Selection(startPos, endPos);
    }
}

/**
 * Strategy for multi-line selections.
 * Searches forward through lines to find where the selected text ends.
 */
export class MultiLineTextSearchStrategy implements SelectionStrategy {
    private readonly maxSearchLines: number;

    constructor(maxSearchLines: number = 50) {
        this.maxSearchLines = maxSearchLines;
    }

    select(
        editor: vscode.TextEditor,
        startLine: number,
        endLine: number,
        selectedText: string
    ): vscode.Selection {
        const normalizedSelection = selectedText.replace(/\s+/g, ' ').trim();
        let actualEnd = endLine;
        let searchText = '';

        const searchLimit = Math.min(
            startLine + this.maxSearchLines,
            editor.document.lineCount
        );

        for (let line = startLine; line < searchLimit; line++) {
            const lineText = editor.document.lineAt(line).text;
            searchText += lineText + ' ';
            const normalizedSearch = searchText.replace(/\s+/g, ' ').trim();

            if (normalizedSearch.includes(normalizedSelection)) {
                actualEnd = line;
                break;
            }
        }

        const startPos = new vscode.Position(startLine, 0);
        const endPos = new vscode.Position(
            actualEnd,
            editor.document.lineAt(actualEnd).text.length
        );
        return new vscode.Selection(startPos, endPos);
    }
}

/**
 * Strategy for line-range selections (no text matching).
 * Selects entire lines from start to end.
 */
export class LineRangeStrategy implements SelectionStrategy {
    select(
        editor: vscode.TextEditor,
        startLine: number,
        endLine: number,
        selectedText: string
    ): vscode.Selection {
        const startPos = new vscode.Position(startLine, 0);
        const endPos = new vscode.Position(
            endLine,
            editor.document.lineAt(endLine).text.length
        );
        return new vscode.Selection(startPos, endPos);
    }
}
