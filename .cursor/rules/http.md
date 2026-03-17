REST/HTTP

Use `express` to map endpoints.

Use the REST pattern for queries, keeping resource names in English and pluralized to allow navigation through related resources, for example: `/playlists/:playlistId/videos` or `/customers/:customerId/invoices`.

Resources and compound verbs must use `kebab-case`, for example: `scheduled-events` or `process-payment`.

Avoid creating endpoints with more than 3 resources, for example: `/channels/:channelId/playlists/:playlistId/videos/:videoId/comments`.

For mutations, do not follow REST too rigidly. Use a combination of REST to navigate resources and verbs to represent the action being executed, always with `POST`, for example: `/users/:userId/change_password`, avoiding `PUT /users/:userId`.

The request and response payload format must always be JSON, unless a different format is explicitly specified.

Always follow security rules by validating authentication and authorization.

Return types:

Return `200` when successful.

Return `404` if a resource is not found.

Return `500` for unexpected errors.

Return `422` for business-rule errors.

Return `400` if the request is malformed.

Return `401` if the user is not authenticated.

Return `403` if the user is not authorized.

Document endpoints, methods, and status codes for each endpoint using OpenAPI.

Implement pagination for more complex queries based on `limit` and `offset` passed through the query string.

Implement partial responses for queries that return large amounts of data.

Use `axios` to make calls to external APIs.
