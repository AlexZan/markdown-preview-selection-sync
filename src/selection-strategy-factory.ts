import {
    SelectionStrategy,
    SingleLineCharacterStrategy,
    MultiLineTextSearchStrategy,
    LineRangeStrategy
} from './selection-strategies';

/**
 * Factory for selecting the appropriate selection strategy based on the request.
 */
export class SelectionStrategyFactory {
    private readonly singleLineStrategy: SingleLineCharacterStrategy;
    private readonly multiLineStrategy: MultiLineTextSearchStrategy;
    private readonly lineRangeStrategy: LineRangeStrategy;

    constructor(maxSearchLines: number = 50) {
        this.singleLineStrategy = new SingleLineCharacterStrategy();
        this.multiLineStrategy = new MultiLineTextSearchStrategy(maxSearchLines);
        this.lineRangeStrategy = new LineRangeStrategy();
    }

    /**
     * Selects the appropriate strategy based on the selection request.
     */
    getStrategy(
        startLine: number,
        endLine: number,
        selectedText: string
    ): SelectionStrategy {
        // No text: use line range strategy
        if (!selectedText || selectedText.trim().length === 0) {
            return this.lineRangeStrategy;
        }

        // Single line with text: use character-level precision
        if (startLine === endLine) {
            return this.singleLineStrategy;
        }

        // Multi-line with text: use text search strategy
        return this.multiLineStrategy;
    }
}
