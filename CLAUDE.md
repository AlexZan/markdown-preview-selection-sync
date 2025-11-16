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

## Problem Resolution

**CRITICAL**: You are NOT allowed to say a problem is resolved until the user confirms it is resolved.

**Rules:**
- Never remove debug logging or assume a fix works without user testing
- Never claim "the issue is fixed" or "ready to commit" without user verification
- Always wait for explicit user confirmation before cleaning up debug code
- If you make a fix, report what you did and ask the user to test it
- Only after user says "it works" or "problem solved" can you proceed with cleanup

## Git Commit Messages and Issue Linking

**CRITICAL**: Always link commits to GitHub issues when fixing bugs or implementing features.

**Workflow:**
1. Commit the fix with issue reference in message
2. Close the issue with commit hash in the close comment

**Commit Message Rules:**
- When closing an issue, include "Fixes #N" or "Closes #N" in commit message
- When referencing an issue, include "Related to #N" or "See #N"
- Use GitHub's special keywords to auto-close issues: fixes, closes, resolves
- Place issue references in the first line or in the body of the commit message

**Issue Closing Rules:**
- Always reference the commit hash when closing an issue
- Use format: `gh issue close N --reason completed --comment "Fixed in commit HASH. <brief description>"`

**Examples:**
- ✅ GOOD Commit: "Fix config loss in separate preview mode (fixes #3)"
- ✅ GOOD Close: `gh issue close 3 --comment "Fixed in commit 9932e38. Implemented sessionStorage caching..."`
- ❌ BAD: Closing issue without commit hash reference
