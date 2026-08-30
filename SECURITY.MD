# Security Policy

Thank you for helping keep **PR Guardian AI** secure. We appreciate responsible disclosure of potential security vulnerabilities.

---

## Supported Versions

| Version  | Supported       |
| -------- | --------------- |
| **v1.x** | ✅ Supported     |
| **v0.x** | ❌ Not Supported |

---

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not create a public GitHub issue**.

Instead, report it privately to the maintainers with the following information:

* Description of the vulnerability.
* Steps to reproduce.
* Expected vs actual behavior.
* Affected files or components.
* Screenshots or logs (if applicable).

We aim to acknowledge security reports within **48 hours** and provide updates during the investigation process.

---

## Security Practices

PR Guardian AI follows these security best practices:

* IBM watsonx.ai API credentials are stored in environment variables (`.env`) and are never committed to Git.
* Repository reviews are processed through a backend service instead of exposing credentials in the VS Code extension.
* Sensitive files are excluded from repository indexing using `.bobignore`.
* Git ignores local secrets, virtual environments, build artifacts, and generated files using `.gitignore`.

---

## Scope

This security policy covers the following components:

* FastAPI backend.
* VS Code Extension.
* IBM Granite / watsonx.ai integration.
* Replay AI Review engine.
* Repository Intelligence Dashboard.
* RAG-based repository retrieval.

Third-party GitHub repositories analyzed by PR Guardian AI are **outside the scope** of this policy.

---

## Security Recommendations for Contributors

When contributing to PR Guardian AI:

* Never commit API keys, access tokens, or credentials.
* Use `.env.example` as the template for environment configuration.
* Store production secrets only in local `.env` files.
* Validate repository inputs before sending requests to backend services.
* Review pull requests for hardcoded credentials and insecure code patterns.

---

## Responsible Disclosure

Please allow the maintainers reasonable time to investigate and resolve reported vulnerabilities before publicly disclosing them.

We appreciate responsible security research and coordinated disclosure.
