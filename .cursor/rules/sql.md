SQL/Database

Use `pg-promise` to connect to the database.

Always use table and column names in English, pluralized, and in `snake_case`.

For primary and foreign keys, always use the singular table name followed by `_id`, for example: `users -> user_id`, `customers -> customer_id`, `orders -> order_id`, `payments -> payment_id`.

Use uppercase for reserved words, for example `SELECT`, `FROM`, `JOIN`, `WHERE`.

Always use `JOIN` instead of selecting tables separately and combining them in the `WHERE` clause.

If possible, prefer joining with `USING` instead of `ON`.

Never use `*` in a `SELECT`. Always make it explicit which columns are being returned.

For string types, always use `text`; do not use `varchar`.

For numeric types, use `int` or `numeric` depending on whether floating-point values are needed.

For dates, use the `timestamptz` type.

When a column will be used for searches, create an index.

Whenever possible, solve grouping or sorting concerns directly in the query with `GROUP BY` and `ORDER BY`.

If you use `ORDER BY`, always indicate whether the order is `DESC` or `ASC`.

Always use prepared statements and never interpolate strings into queries.

When it makes sense, prefer `IN` and `BETWEEN` instead of combinations using `AND` and `OR`.

Break lines after `SELECT`, `FROM`, `WHERE`, `GROUP BY`, and `ORDER BY`.

Use constraints such as `NOT NULL` whenever they make sense and are aligned with the application behavior.

Every table must have `created_at` and `updated_at`.

Whenever you make any database change, create one migration to apply it and another to roll it back if necessary.
