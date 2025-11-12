(function () {
    try {
        console.log('[Preview Script] Loading...');

        // Don't acquire VS Code API - we don't actually need it for this extension
        // (We use URI navigation instead of postMessage)

    /**
     * Finds the line number associated with a DOM node by traversing up the tree
     * to find an element with a data-line attribute.
     */
    function getLineNumber(node) {
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-line')) {
                const lineNum = parseInt(node.getAttribute('data-line'), 10);
                console.log('[Preview Script] Found data-line:', lineNum, 'on', node.tagName);
                return lineNum;
            }
            node = node.parentElement;
        }
        console.log('[Preview Script] No data-line found for node');
        return null;
    }

    /**
     * Gets the line range for the current selection in the preview.
     * Returns null if no valid selection or no line numbers found.
     */
    function getSelectionLineRange() {
        const selection = window.getSelection();

        // No selection or collapsed selection (just a cursor)
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
            return null;
        }

        const range = selection.getRangeAt(0);

        // Get line numbers for start and end of selection
        const startLine = getLineNumber(range.startContainer);
        const endLine = getLineNumber(range.endContainer);

        // If we couldn't find line numbers, return null
        if (startLine === null || endLine === null) {
            return null;
        }

        // Ensure startLine <= endLine
        return {
            startLine: Math.min(startLine, endLine),
            endLine: Math.max(startLine, endLine)
        };
    }

    /**
     * Handles mouse up event to sync selection after user finishes selecting.
     */
    function handleMouseUp() {
        console.log('[Preview Script] Mouse up - checking selection');

        const lineRange = getSelectionLineRange();

        if (lineRange) {
            console.log('[Preview Script] Line range:', lineRange);

            // Construct the URI to trigger the extension's URI handler
            const uri = `vscode://alexzanfir.markdown-preview-selection-sync?startLine=${lineRange.startLine}&endLine=${lineRange.endLine}`;
            console.log('[Preview Script] Triggering URI:', uri);

            // Trigger navigation via a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = uri;
            anchor.style.display = 'none';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            console.log('[Preview Script] URI triggered');
        } else {
            console.log('[Preview Script] No valid line range');
        }
    }

    // Listen for mouseup to sync selection when user finishes selecting
    document.addEventListener('mouseup', handleMouseUp);
    console.log('[Preview Script] Event listener attached');

    // Clean up on unload
    window.addEventListener('beforeunload', () => {
        console.log('[Preview Script] Unloading');
        document.removeEventListener('mouseup', handleMouseUp);
    });

        console.log('[Preview Script] Initialization complete');
    } catch (error) {
        console.error('[Preview Script] Fatal error:', error);
    }
})();
