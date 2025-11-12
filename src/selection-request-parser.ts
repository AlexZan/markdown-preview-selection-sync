import * as vscode from 'vscode';

/**
 * Represents a parsed selection request from the preview.
 */
export interface SelectionRequest {
    startLine: number;
    endLine: number;
    selectedText: string;
    startOffset?: number;
    endOffset?: number;
}

/**
 * Parses and validates URI query parameters for selection requests.
 */
export class SelectionRequestParser {
    /**
     * Parses a URI from the preview into a SelectionRequest.
     * Returns null if required parameters are missing or invalid.
     */
    static parse(uri: vscode.Uri): SelectionRequest | null {
        const query = new URLSearchParams(uri.query);

        const startLine = query.get('startLine');
        const endLine = query.get('endLine');
        const selectedText = query.get('text') || '';

        if (startLine === null || endLine === null) {
            console.warn('Missing startLine or endLine parameters');
            return null;
        }

        const start = parseInt(startLine, 10);
        const end = parseInt(endLine, 10);

        if (isNaN(start) || isNaN(end)) {
            console.warn('Invalid line numbers:', startLine, endLine);
            return null;
        }

        return {
            startLine: start,
            endLine: end,
            selectedText: selectedText,
            startOffset: this.parseOptionalInt(query.get('startOffset')),
            endOffset: this.parseOptionalInt(query.get('endOffset'))
        };
    }

    private static parseOptionalInt(value: string | null): number | undefined {
        if (value === null) return undefined;
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? undefined : parsed;
    }
}
