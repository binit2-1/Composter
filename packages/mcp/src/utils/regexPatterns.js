// -------------------------------------------------------------------------
// PATTERN: List components in a specific category
// "show components in buttons", "what's in ui", "list items in forms"
// -------------------------------------------------------------------------
export const categoryListPatterns = [
    /(?:show|list|get|what'?s?)\s+(?:components?|items?)?\s*(?:in|from|under)\s+['"]?([a-z0-9_-]+)['"]?/i,
    /(?:in|from)\s+['"]?([a-z0-9_-]+)['"]?\s+(?:category|folder)/i,
    /['"]?([a-z0-9_-]+)['"]?\s+(?:components?|category)/i,
];

// -------------------------------------------------------------------------
// PATTERN: Read/show a specific component
// "read Button from ui", "show me the Card component", "get LoginForm from auth"
// -------------------------------------------------------------------------
export const readPatterns = [
    // "read X from Y", "get X from Y", "show X from Y"
    /(?:read|show|get|open|fetch|view|display)\s+['"]?(.+?)['"]?\s+(?:from|in)\s+['"]?([a-z0-9_-]+)['"]?/i,
    // "X component from Y"
    /['"]?(.+?)['"]?\s+(?:component\s+)?(?:from|in)\s+['"]?([a-z0-9_-]+)['"]?/i,
];


// -------------------------------------------------------------------------
// PATTERN: Read component (without category specified)
// "show me the Button component", "get Card", "read LoginForm"
// -------------------------------------------------------------------------
export const simpleReadPatterns = [
    /(?:read|show|get|open|fetch|view|display)\s+(?:me\s+)?(?:the\s+)?['"]?(.+?)['"]?(?:\s+component)?$/i,
    /^['"]?(.+?)['"]?\s+(?:code|source|component)$/i,
];

// -------------------------------------------------------------------------
// PATTERN: Search
// "find buttons", "search for cards", "look up forms"
// -------------------------------------------------------------------------
export const searchPatterns = [
    /(?:search|find|look\s*up|look\s*for)\s+(?:for\s+)?['"]?(.+?)['"]?$/i,
    /^['"]?(.+?)['"]?\s+(?:search|find)$/i,
];