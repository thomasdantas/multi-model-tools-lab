Coding Standards

All source code must be written in English.

Use `camelCase` for methods, functions, and variables, `PascalCase` for classes and interfaces, and `kebab-case` for files and directories.

Avoid abbreviations, but also do not write names that are too long (more than 30 characters).

Declare constants for magic numbers to improve readability.

Methods and functions must perform a clear, well-defined action, and that must be reflected in their name, which should start with a verb, never a noun.

Whenever possible, avoid passing more than 3 parameters. Prefer using objects when necessary.

Avoid side effects. In general, a method or function should either perform a mutation or a query; never allow a query to have side effects.

Never nest more than two `if/else` blocks. Always prefer early returns.

Never use flag parameters to switch the behavior of methods and functions. In those cases, extract the logic into methods and functions with specific behaviors.

Avoid long methods, especially those over 50 lines.

Avoid long classes, especially those over 300 lines.

Avoid blank lines inside methods and functions.

Avoid using comments whenever possible.

Never declare more than one variable on the same line.

Declare variables as close as possible to where they will be used.
