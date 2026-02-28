import pytest
import re
import sys
from pathlib import Path

# Add project root to path so we can import error_monitor
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from error_monitor import _ERROR_PATTERN

def test_error_pattern_matching_nextjs():
    """Test that _ERROR_PATTERN correctly matches Next.js/JavaScript errors."""
    
    # Types of errors we expect from the frontend stack
    front_errors = [
        "FAILED to compile",
        "Unhandled Runtime Error",
        "Uncaught TypeError: Cannot read properties of undefined",
        "SyntaxError: Unexpected token",
        "ReferenceError: window is not defined",
        "RangeError: Maximum call stack size exceeded",
        "Type error: Property 'foo' does not exist on type 'Bar'.",
        "Module not found: Error: Can't resolve",
        "Build failed with 1 error"
    ]
    
    for err_msg in front_errors:
        assert _ERROR_PATTERN.search(err_msg) is not None, f"Failed to match NextJS error: {err_msg}"

def test_error_pattern_matching_rust():
    """Test that _ERROR_PATTERN correctly matches Rust errors if Tauri is used internally."""
    rust_errors = [
        "thread 'main' panicked at",
        "RUST_BACKTRACE=1 environment variable to display a backtrace",
        "Failed to load user info. Error = 404",
        "error[E0599]: no method named `unwrap` found for struct `Foo` in the current scope"
    ]
    
    for err_msg in rust_errors:
        assert _ERROR_PATTERN.search(err_msg) is not None, f"Failed to match Rust error: {err_msg}"

def test_error_pattern_does_not_match_normal_logs():
    """Test that _ERROR_PATTERN does not match normal info warnings or requests."""
    normal_logs = [
        "INFO: Started server process",
        "GET /api/users 200 OK",
        "Warning: Invalid DOM property `class`",
    ]
    
    for log_msg in normal_logs:
        assert _ERROR_PATTERN.search(log_msg) is None, f"Incorrectly matched normal log: {log_msg}"
