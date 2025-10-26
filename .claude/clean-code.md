## Single Responsibility

- Each class/method does one thing well
- Keep methods small (prefer under 30 lines)
- DRY: Avoid duplicated logic

## Code Clarity

- Write self-documenting code
- Use descriptive names
- Avoid magic numbers; use named constants

## Naming Conventions

- Booleans: `isActive`
- Methods: verbs (`getUserData`)
- Classes: nouns (`UserService`)

## Control Flow

- Prefer early returns over nested conditionals (max 3 levels)
- Methods should return consistent types

## Error Handling

- Handle errors explicitly
- Don't ignore caught errors

## Classes & Objects

- Prefer classes over standalone functions
- Encapsulate related data and behavior
- Use private fields/methods for encapsulation
- Favor composition over inheritance
- Use dependency injection
- Keep method signatures simple (max 3-4 parameters; use objects for many parameters)
- Follow SOLID: Open/Closed, Interface Segregation, Dependency Inversion
- Maintain low coupling and high cohesion between classes
- Minimize dependencies between modules

## Comments

- Comment the "why", not the "what"
- Use comments for non-obvious decisions, workarounds, or business context

## Side Effects

- Isolate side effects (I/O, APIs, database operations) from business logic
- Make side effects explicit and easy to identify
