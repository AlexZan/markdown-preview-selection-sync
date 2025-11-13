(function () {
    try {
        // Configuration
        // NOTE: Due to markdown preview script isolation, config must be set here manually
        // VS Code settings are defined in package.json but can't be automatically injected
        // TODO: Implement config injection via custom markdown-it plugin or message passing
        const config = {
            requireModifierKey: true, // Set to false to sync without modifier key
            modifierKey: 'ctrl' // Options: 'ctrl', 'alt', 'meta' (Cmd on Mac)
        };

        /**
         * Checks if the required modifier key is pressed.
         */
        class ModifierKeyChecker {
            static isModifierPressed(event) {
                if (!config.requireModifierKey) {
                    return true; // No modifier required
                }

                switch (config.modifierKey) {
                    case 'ctrl':
                        return event.ctrlKey;
                    case 'alt':
                        return event.altKey;
                    case 'meta':
                        return event.metaKey; // Cmd on Mac, Windows key on Windows/Linux
                    default:
                        return false;
                }
            }
        }

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
        function handleMouseUp(event) {
            // Check if modifier key requirement is met
            if (!ModifierKeyChecker.isModifierPressed(event)) {
                return; // Modifier key not pressed, don't sync
            }

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
