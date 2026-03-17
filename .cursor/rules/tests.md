Testing

Use the `jest` library to define test scenarios and expectations, and `sinon` to implement test patterns such as stubs, spies, and mocks.

To run the tests, use the command `yarn test`.

All tests must live inside the `/test` folder. Do not place tests inside `/src` alongside the files being tested.

Tests must use the `.test.ts` extension.

Do not create dependencies between tests. It must be possible to run each test independently.

Follow the Arrange, Act, Assert or Given, When, Then principle to keep tests organized and readable.

If you are testing behavior that depends on a `Date`, and that dependency is important to the behavior under test, use a mock to ensure the test is repeatable.

If a test depends on external resources such as HTTP requests, databases, messaging systems, the file system, or external APIs, it must go in `/test/integration`. Otherwise, it can go in `/test/unit`.

Create tests for HTTP endpoints. These tests must not use libraries such as `supertest` and must be integration tests. Also, create these tests only to validate the main and alternative flows, focusing primarily on status codes and error messages, while leaving business-rule variations to the use case tests.

Create tests for all use cases. In these tests, always cover the main flow and at least one alternative flow that throws exceptions. Use the stub pattern to avoid calling external APIs at this test level.

Create tests for the entire domain layer. Test every rule possibility and all possible variations, always at the unit level and without depending on any external resources.

Focus on testing one behavior per test. Avoid writing very large tests.

Ensure the code being written is fully covered by tests.

Create consistent expectations, ensuring that everything under test is actually being verified.

Always close connections to databases or messaging platforms after running the tests.

Use `beforeEach` for initialization.
