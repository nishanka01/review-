import re
from typing import Dict, Any

def grader_naming(code: str) -> float:
    """Checks if single-letter variable names a, b, c have been removed/replaced."""
    patterns = [r'\ba\b', r'\bb\b', r'\bc\b']
    found = 0
    for p in patterns:
        if re.search(p, code):
            found += 1
    
    # 0 single-letter names = 1.0, 3 = 0.0
    score = max(0.0, 1.0 - (found / 3.0))
    return score

def grader_optimization(code: str) -> float:
    """Checks for the presence of 'set(' or '{' indicating O(1) lookup structure."""
    if "set(" in code or "{" in code:
        return 1.0
    if "for " in code and "if " in code:
        return 0.1 # Still inefficient
    return 0.0

def grader_security(code: str) -> float:
    """Checks if parameterized queries are used (SQL string interpolation removed)."""
    # Look for placeholders like ?, %s, or :var and the absence of f-strings or format() with query
    query_pattern = r"SELECT.*FROM.*WHERE"
    interpolation_patterns = [r"f\"", r"f\'", r"\.format\(", r"\+"]
    
    if re.search(query_pattern, code, re.IGNORECASE):
        # If query exists, check if it's safe
        is_safe = True
        for p in interpolation_patterns:
            if re.search(p, code):
                is_safe = False
                break
        
        # Check for parameterized style
        if is_safe and ("," in code or "%" in code or ":" in code):
            return 1.0
        elif not is_safe:
            return 0.0
    return 0.5 # Neutral if query logic is removed entirely (not ideal)

def grader_naming_js(code: str) -> float:
    """Checks if single-letter variable names i, j, k have been replaced (common in JS loops)."""
    patterns = [r'\bi\b', r'\bj\b', r'\bk\b']
    found = 0
    for p in patterns:
        if re.search(p, code):
            found += 1
    return max(0.0, 1.0 - (found / 3.0))

def grader_scope_js(code: str) -> float:
    """Checks if 'var' has been replaced with 'let' or 'const'."""
    if "var " in code:
        return 0.0
    if "let " in code or "const " in code:
        return 1.0
    return 0.5

def grader_security_js(code: str) -> float:
    """Checks for XSS prevention (innerHTML vs textContent)."""
    if "textContent" in code:
        return 1.0
    if "innerHTML" in code:
        return 0.0
    return 0.5

GRADERS = {
    "grader_naming": grader_naming,
    "grader_optimization": grader_optimization,
    "grader_security": grader_security,
    "grader_naming_js": grader_naming_js,
    "grader_scope_js": grader_scope_js,
    "grader_security_js": grader_security_js
}

def get_grader(grader_id: str):
    return GRADERS.get(grader_id)
