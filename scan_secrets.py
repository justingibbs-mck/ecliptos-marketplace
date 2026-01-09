#!/usr/bin/env python3
"""
Quick secret scanner for the codebase.
Scans for common patterns that might indicate secrets or private keys.
"""
import os
import re
from pathlib import Path

# Patterns to search for
PATTERNS = {
    "AWS Access Key": r"AKIA[0-9A-Z]{16}",
    "AWS Secret Key": r"aws_secret_access_key\s*[=:]\s*['\"][^'\"]{20,}['\"]",
    "Google API Key": r"AIza[0-9A-Za-z_-]{35}",
    "Stripe Key": r"sk_(live|test)_[0-9a-zA-Z]{32,}",
    "Private Key (RSA/DSA/EC)": r"-----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----",
    "SSH Key": r"ssh-(rsa|ed25519) AAAA[0-9A-Za-z+/=]{100,}",
    "Hardcoded Password": r"(password|passwd|pwd)\s*[=:]\s*['\"][^'\"]{8,}['\"]",
    "API Key Pattern": r"(api[_-]?key|apikey)\s*[=:]\s*['\"][^'\"]{20,}['\"]",
    "Bearer Token": r"Bearer\s+[A-Za-z0-9\-._~+/]{20,}",
    "JWT Token": r"eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*",
    "Database URL with credentials": r"(postgres|mysql|mongodb|redis)://[^:]+:[^@]+@",
    "GitHub Token": r"ghp_[A-Za-z0-9]{36}",
    "Slack Token": r"xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24,}",
}

# Files to skip
SKIP_PATTERNS = [
    ".git",
    "__pycache__",
    ".ipynb_checkpoints",
    "node_modules",
    ".venv",
    "venv",
    ".env",
    "scan_secrets.py",  # Skip this script itself
]

# File extensions to scan
SCAN_EXTENSIONS = {".py", ".yaml", ".yml", ".json", ".txt", ".md", ".sh", ".bat", ".env", ".config"}

def should_skip_file(file_path: Path) -> bool:
    """Check if file should be skipped."""
    path_str = str(file_path)
    return any(skip in path_str for skip in SKIP_PATTERNS)

def scan_file(file_path: Path) -> list:
    """Scan a single file for secrets."""
    findings = []
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            lines = content.split("\n")
            
            for pattern_name, pattern in PATTERNS.items():
                matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    # Get line number
                    line_num = content[:match.start()].count("\n") + 1
                    line_content = lines[line_num - 1] if line_num <= len(lines) else ""
                    
                    findings.append({
                        "file": str(file_path),
                        "line": line_num,
                        "pattern": pattern_name,
                        "match": match.group()[:50] + "..." if len(match.group()) > 50 else match.group(),
                        "context": line_content.strip()[:100],
                    })
    except Exception as e:
        print(f"Error scanning {file_path}: {e}")
    
    return findings

def scan_directory(root_dir: Path) -> list:
    """Recursively scan directory for secrets."""
    all_findings = []
    
    for root, dirs, files in os.walk(root_dir):
        # Filter out directories to skip
        dirs[:] = [d for d in dirs if not should_skip_file(Path(root) / d)]
        
        for file in files:
            file_path = Path(root) / file
            
            if should_skip_file(file_path):
                continue
            
            if file_path.suffix in SCAN_EXTENSIONS or file_path.name.startswith("."):
                findings = scan_file(file_path)
                all_findings.extend(findings)
    
    return all_findings

def main():
    """Main function."""
    root_dir = Path(__file__).parent
    print(f"Scanning {root_dir} for potential secrets...")
    print("=" * 70)
    
    findings = scan_directory(root_dir)
    
    if findings:
        print(f"\n⚠️  Found {len(findings)} potential secret(s):\n")
        for finding in findings:
            print(f"File: {finding['file']}")
            print(f"Line: {finding['line']}")
            print(f"Pattern: {finding['pattern']}")
            print(f"Match: {finding['match']}")
            print(f"Context: {finding['context']}")
            print("-" * 70)
        print("\n⚠️  Please review these findings carefully before pushing to GitHub!")
        return 1
    else:
        print("\n✅ No obvious secrets found in the codebase.")
        print("Note: This is a basic scan. Consider using tools like:")
        print("  - git-secrets (https://github.com/awslabs/git-secrets)")
        print("  - truffleHog (https://github.com/trufflesecurity/trufflehog)")
        print("  - gitleaks (https://github.com/gitleaks/gitleaks)")
        return 0

if __name__ == "__main__":
    exit(main())

