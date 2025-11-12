# Multi-line Selection Test

## Test Case 1: Long Paragraph

This is a test paragraph that spans multiple lines in the source editor. When you select text that covers multiple lines within this paragraph in the preview, the extension should now correctly select all those lines in the source, not just the first line. This is exactly the issue we're fixing with the text-matching approach.

## Test Case 2: Another Paragraph

Line one of this paragraph.
Line two of this paragraph.
Line three of this paragraph.
Line four of this paragraph.

## Test Case 3: Short Block

Just one line here.

## Test Case 4: Code Block

```javascript
function example() {
    console.log('line 1');
    console.log('line 2');
    console.log('line 3');
}
```

## Instructions

1. Open this file in VS Code
2. Open preview (Ctrl+K V)
3. Select text that spans multiple lines within Test Case 1
4. The extension should now select all the lines that contain your selected text
