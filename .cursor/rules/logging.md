Logging

Use the `winston` library for logging.

Use the `DEBUG` and `ERROR` levels appropriately to record logs that are useful for understanding what happened or errors that need to be investigated.

Never store logs in files. Always redirect them through the process itself.

Never log sensitive data such as names, addresses, or people's credit card information.

Always keep log messages clear, without overdoing them or using long texts.

Do not use `console.log` or `console.error` for logging.

Never silence exceptions. Always log them.
