# Project Instructions

## Response Format

**CRITICAL**: Never include large code blocks in responses unless:
- It's a few lines or less (< 5 lines)
- User explicitly requests to see the code
- It's required to explain a specific point

**Why this matters:**
- Wastes tokens showing code that's already in files
- Bloats responses and reduces clarity
- User can read files directly via links

**Instead:**
- Provide file links: [extension.ts](src/extension.ts)
- Reference specific lines: [extension.ts:76-84](src/extension.ts#L76-L84)
- Give clear, concise explanations
- Let the user open files when needed

**Examples:**
- ❌ BAD: Show 50+ lines of refactored code in response
- ✅ GOOD: "Extracted selection logic to [selection-strategies.ts](src/selection-strategies.ts)"
