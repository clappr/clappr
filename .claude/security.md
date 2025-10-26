## Code Injection

- Never use eval() or Function() constructor
- Validate URLs before redirects or window.open()

## XSS (Cross-Site Scripting)

- Avoid innerHTML with user input; use textContent or DOM APIs
- Sanitize and encode user-generated content for the correct context (HTML, JavaScript, URL)

## Authentication & Tokens

- Never store tokens in localStorage (use httpOnly cookies or memory)
- No hardcoded credentials or API keys in code

## Data Exposure

- No sensitive data in logs, console, or error messages
- No sensitive data in URLs or HTML attributes

## Prototype Pollution

- Validate keys when merging objects from untrusted sources (avoid `__proto__`, constructor, prototype)
- Use Object.create(null) or schema validation (Zod, Joi) for external configs

## PostMessage Security

- Always validate event.origin and message structure before processing
- Use specific targetOrigin (never "*") when sending messages

## External Resources

- Use rel="noopener noreferrer" for target="\_blank" links
- Validate and sanitize third-party content

## CSRF Protection

- Include CSRF tokens in state-changing requests
