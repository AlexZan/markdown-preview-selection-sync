(function () {
    try {
        /**
         * Traverses DOM tree to find line numbers from data-line attributes.
         */
        class LineNumberTraverser {
            static findLineNumber(node) {
                while (node) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-line')) {
                        return parseInt(node.getAttribute('data-line'), 10);
                    }
                    node = node.parentElement;
                }
                return null;
            }
        }

        /**
         * Analyzes browser selections and extracts line range data.
         */
        class SelectionAnalyzer {
            static analyze() {
                const selection = window.getSelection();

                if (!this.isValidSelection(selection)) {
                    return null;
                }

                const range = selection.getRangeAt(0);
                const startLine = LineNumberTraverser.findLineNumber(range.startContainer);
                const endLine = LineNumberTraverser.findLineNumber(range.endContainer);

                if (startLine === null || endLine === null) {
                    return null;
                }

                return {
                    startLine: Math.min(startLine, endLine),
                    endLine: Math.max(startLine, endLine),
                    text: selection.toString().trim(),
                    startOffset: range.startOffset,
                    endOffset: range.endOffset
                };
            }

            static isValidSelection(selection) {
                return selection && selection.rangeCount > 0 && !selection.isCollapsed;
            }
        }

        /**
         * Triggers selection sync by navigating to extension URI.
         */
        class SelectionSyncTrigger {
            static trigger(selectionData) {
                const encodedText = encodeURIComponent(selectionData.text);
                const uri = `vscode://alexzanfir.markdown-preview-selection-sync?startLine=${selectionData.startLine}&endLine=${selectionData.endLine}&text=${encodedText}&startOffset=${selectionData.startOffset}&endOffset=${selectionData.endOffset}`;

                const anchor = document.createElement('a');
                anchor.href = uri;
                anchor.style.display = 'none';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }
        }

        /**
         * Main handler for mouseup events.
         */
        function handleMouseUp() {
            const selectionData = SelectionAnalyzer.analyze();
            if (selectionData) {
                SelectionSyncTrigger.trigger(selectionData);
            }
        }

        // Listen for mouseup to sync selection when user finishes selecting
        document.addEventListener('mouseup', handleMouseUp);

        // Clean up on unload
        window.addEventListener('beforeunload', () => {
            document.removeEventListener('mouseup', handleMouseUp);
        });
    } catch (error) {
        console.error('[Preview Script] Fatal error:', error);
    }
})();
