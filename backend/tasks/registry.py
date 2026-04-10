from typing import List, Dict, Any

TASKS = [
    {
        "id": "task_1",
        "language": "python",
        "difficulty": "easy",
        "title": "Fix Variable Naming",
        "objective": "Replace single-letter variable names (a, b, c) with descriptive names.",
        "initial_code": "def calculate_area(a, b):\n    c = a * b\n    return c",
        "grader_id": "grader_naming"
    },
    {
        "id": "task_2",
        "language": "python",
        "difficulty": "medium",
        "title": "Optimize Sequential Search",
        "objective": "The current function is O(n). Optimize it to O(1) by using a set or dictionary.",
        "initial_code": "def check_user_exists(users, target_id):\n    # users is a list of strings\n    for u in users:\n        if u == target_id:\n            return True\n    return False",
        "grader_id": "grader_optimization"
    },
    {
        "id": "task_3",
        "language": "python",
        "difficulty": "hard",
        "title": "Prevent SQL Injection",
        "objective": "The current code uses string formatting for SQL queries. Refactor it to use parameterized queries.",
        "initial_code": "def get_user_data(db_cursor, user_id):\n    query = f\"SELECT * FROM users WHERE id = '{user_id}'\"\n    return db_cursor.execute(query).fetchone()",
        "grader_id": "grader_security"
    },
    {
        "id": "js_task_1",
        "language": "javascript",
        "difficulty": "easy",
        "title": "Modernize Loop Naming",
        "objective": "Replace single-letter loop variables (i, j, k) with descriptive names in this array processor.",
        "initial_code": "function processData(items) {\n    for (let i = 0; i < items.length; i++) {\n        let k = items[i] * 2;\n        console.log(k);\n    }\n}",
        "grader_id": "grader_naming_js"
    },
    {
        "id": "js_task_2",
        "language": "javascript",
        "difficulty": "medium",
        "title": "Fix Variable Scoping",
        "objective": "Replace legacy 'var' keywords with modern 'let' or 'const' for better scoping.",
        "initial_code": "function initApp() {\n    var host = 'localhost';\n    var port = 8080;\n    console.log('Running on ' + host + ':' + port);\n}",
        "grader_id": "grader_scope_js"
    },
    {
        "id": "js_task_3",
        "language": "javascript",
        "difficulty": "hard",
        "title": "Prevent XSS Attack",
        "objective": "Avoid using 'innerHTML' which can lead to XSS. Use 'textContent' for safer DOM updates.",
        "initial_code": "function updateStatus(userMsg) {\n    const statusArea = document.getElementById('status');\n    statusArea.innerHTML = 'Status: ' + userMsg;\n}",
        "grader_id": "grader_security_js"
    }
]

def get_task_by_id(task_id: str) -> Dict[str, Any]:
    for task in TASKS:
        if task["id"] == task_id:
            return task
    return None
