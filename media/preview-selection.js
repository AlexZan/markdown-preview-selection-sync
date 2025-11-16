(function () {
    try {
        console.log('[Preview Script] ========================================');
        console.log('[Preview Script] SCRIPT LOADED - timestamp:', Date.now());
        console.log('[Preview Script] document.URL:', document.URL);
        console.log('[Preview Script] document.readyState:', document.readyState);
        console.log('[Preview Script] ========================================');

        // Configuration
        // Try to get config from data attribute (injected by markdown-it plugin)
        // If not found, use sessionStorage cache (persists across preview reloads in separate tab mode)
        const STORAGE_KEY = 'markdown-preview-selection-sync-config';

        const bodyConfig = document.body?.getAttribute('data-markdown-preview-config');
        const containerConfig = document.querySelector('[data-markdown-preview-config]')?.getAttribute('data-markdown-preview-config');
        const configJson = bodyConfig || containerConfig;

        let config;
        if (configJson) {
            // Config found in HTML - parse and cache it
            try {
                config = JSON.parse(configJson);
                console.log('[Preview Script] Config loaded from data attribute:', config);
                // Cache in sessionStorage for when VS Code reloads preview without re-rendering markdown
                sessionStorage.setItem(STORAGE_KEY, configJson);
            } catch (e) {
                console.error('[Preview Script] Failed to parse config JSON:', e);
            }
        }

        if (!config) {
            // Try to load from sessionStorage cache
            const cachedConfig = sessionStorage.getItem(STORAGE_KEY);
            if (cachedConfig) {
                try {
                    config = JSON.parse(cachedConfig);
                    console.log('[Preview Script] Config loaded from sessionStorage (cached):', config);
                } catch (e) {
                    console.error('[Preview Script] Failed to parse cached config:', e);
                }
            }
        }

        if (!config) {
            const errorMsg = '[Preview Script] FATAL ERROR: Config not found in data attribute or sessionStorage!';
            console.error(errorMsg);
            console.error('[Preview Script] This usually means the extension did not load correctly.');
            console.error('[Preview Script] Try: 1) Reload VS Code, 2) Check extension is enabled, 3) Re-render markdown (edit file)');
            throw new Error(errorMsg);
        }

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

        // Cache the last valid selection so we can still trigger after VS Code collapses the DOM selection.
        const SELECTION_DEBOUNCE_MS = 150;
        const SELECTION_MAX_AGE_MS = 1000;
        let lastSelectionData = null;
        let lastSelectionTimestamp = 0;
        let selectionChangeTimer;

        function captureSelectionSnapshot() {
            const selectionData = SelectionAnalyzer.analyze();
            if (selectionData) {
                lastSelectionData = selectionData;
                lastSelectionTimestamp = Date.now();
            }
        }

        function handleSelectionChange() {
            if (selectionChangeTimer) {
                clearTimeout(selectionChangeTimer);
            }
            selectionChangeTimer = window.setTimeout(() => {
                captureSelectionSnapshot();
            }, SELECTION_DEBOUNCE_MS);
        }

        /**
         * Main handler for mouseup events.
         */
        function handleMouseUp(event) {
            console.log('[Preview Script] mouseup event triggered');
            console.log('[Preview Script] Current requireModifierKey:', config.requireModifierKey);
            console.log('[Preview Script] Current modifierKey:', config.modifierKey);

            // Check if modifier key requirement is met
            if (!ModifierKeyChecker.isModifierPressed(event)) {
                console.log('[Preview Script] Modifier key not pressed, ignoring');
                return; // Modifier key not pressed, don't sync
            }

            console.log('[Preview Script] Modifier key pressed, analyzing selection');
            const now = Date.now();
            if (!lastSelectionData || now - lastSelectionTimestamp > SELECTION_MAX_AGE_MS) {
                captureSelectionSnapshot();
            }

            if (lastSelectionData) {
                console.log('[Preview Script] Selection data:', lastSelectionData);
                SelectionSyncTrigger.trigger(lastSelectionData);
                lastSelectionData = null;
                lastSelectionTimestamp = 0;
            } else {
                console.log('[Preview Script] No valid selection data');
            }
        }

        // Listen for selection changes to capture positions before VS Code collapses the DOM selection
        console.log('[Preview Script] Adding selectionchange event listener');
        document.addEventListener('selectionchange', handleSelectionChange);

        // Listen for mouseup to sync selection when user finishes selecting
        console.log('[Preview Script] Adding mouseup event listener');
        document.addEventListener('mouseup', handleMouseUp);
        console.log('[Preview Script] Event listeners added successfully');

        // Clean up on unload
        window.addEventListener('beforeunload', () => {
            if (selectionChangeTimer) {
                clearTimeout(selectionChangeTimer);
            }
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('selectionchange', handleSelectionChange);
        });
    } catch (error) {
        console.error('[Preview Script] Fatal error:', error);
    }
})();
