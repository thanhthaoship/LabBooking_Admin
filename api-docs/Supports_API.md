# SupportsController API

## SupportsController

- Controller: `SupportsController`
- Purpose: Manage support tickets (create, update, delete, list, retrieve)
- Base Route: `api/Supports` (`LabBooking\src\LabBooking.API\Controllers\SupportsController.cs:5`)

### Endpoints

#### Create Support

- Method: `POST`
- Path: `api/Supports`
- Summary: Create a new support ticket (`LabBooking\src\LabBooking.API\Controllers\SupportsController.cs:14`).
- Authorization: `Admin`
- Input
  - Body Model: `CreateSupportCommand` (`LabBooking\src\LabBooking.Application\Features\Supports\Commands\CreateSupport\CreateSupportCommand.cs:9`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "Title": { "type": "string" },
        "Content": { "type": "string" }
      },
      "required": ["Title", "Content"]
    }
    ```
- Output
  - Status: `201 Created`
  - Body: none (Location header points to `GET api/Supports/{id}`)
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `401 Unauthorized`, `500 InternalServerError`
- Notes
  - The response body is empty; call `GET /api/Supports/{id}` to fetch the created ticket.

#### Update Support

- Method: `PUT`
- Path: `api/Supports/{id}` where `{id}` is `guid`
- Summary: Update an existing support ticket (`LabBooking\src\LabBooking.API\Controllers\SupportsController.cs:32`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Support ticket identifier
  - Body Model: `UpdateSupportCommand` (`LabBooking\src\LabBooking.Application\Features\Supports\Commands\UpdateSupport\UpdateSupportCommand.cs:8`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "Title": { "type": "string" },
        "Content": { "type": "string" },
        "Answer": { "type": "string" }
      },
      "required": ["Title", "Content"]
    }
    ```
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `401 Unauthorized`, `404 NotFound`, `500 InternalServerError`

#### Delete Support

- Method: `DELETE`
- Path: `api/Supports/{id}` where `{id}` is `guid`
- Summary: Delete an existing support ticket (`LabBooking\src\LabBooking.API\Controllers\SupportsController.cs:53`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Support ticket identifier
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `401 Unauthorized`, `404 NotFound`, `500 InternalServerError`

#### Get All Supports

- Method: `GET`
- Path: `api/Supports`
- Summary: Get support tickets with optional filtering, sorting, and pagination (`LabBooking\src\LabBooking.API\Controllers\SupportsController.cs:71`).
- Authorization: `Admin`
- Input
  - Query Parameters (`GetAllSupportsQuery`) (`LabBooking\src\LabBooking.Application\Features\Supports\Queries\GetAllSupports\GetAllSupportsQuery.cs:16`)
    - `SearchPhrase` (string, optional)
    - `PageNumber` (int)
    - `PageSize` (int)
    - `SortBy` (string, optional)
    - `SortDirection` (string; `Ascending` or `Descending`)
- Output
  - Model: `PagedResult<SupportsResponse>` (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)
  - Properties
    - `Items` (array of `SupportsResponse`)
    - `TotalPages` (int)
    - `TotalItemsCount` (int)
    - `ItemsFrom` (int)
    - `ItemsTo` (int)
  - Example JSON
    ```json
    {
      "items": [
        {
          "id": "f3b0bb9c-5c88-4c37-9f50-9a5a4a7b2e21",
          "title": "Cannot access lab booking",
          "content": "Page returns error 500",
          "answer": "Please clear cache and retry",
          "createdById": "b1a7b124-2f3f-4a9d-9a6a-5c2f8e8d1c44"
        }
      ],
      "totalPages": 3,
      "totalItemsCount": 30,
      "itemsFrom": 1,
      "itemsTo": 10
    }
    ```
- Response Status Codes
  - `200 OK`, `400 BadRequest`, `401 Unauthorized`, `500 InternalServerError`

#### Get Support By Id

- Method: `GET`
- Path: `api/Supports/{id}` where `{id}` is `guid`
- Summary: Get a specific support ticket by Id (`LabBooking\src\LabBooking.API\Controllers\SupportsController.cs:87`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Support ticket identifier
- Output
  - Model: `SupportsResponse` (`LabBooking\src\LabBooking.Application\Features\Supports\Dtos\SupportsResponse.cs:10`)
  - Properties
    - `Id` (guid)
    - `Title` (string)
    - `Content` (string)
    - `Answer` (string)
    - `CreatedById` (guid)
  - Example JSON
    ```json
    {
      "id": "f3b0bb9c-5c88-4c37-9f50-9a5a4a7b2e21",
      "title": "Cannot access lab booking",
      "content": "Page returns error 500",
      "answer": "Please clear cache and retry",
      "createdById": "b1a7b124-2f3f-4a9d-9a6a-5c2f8e8d1c44"
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `404 NotFound`, `500 InternalServerError`

### Response Models

#### SupportsResponse (`LabBooking\src\LabBooking.Application\Features\Supports\Dtos\SupportsResponse.cs:10`)

| Property       | Type     | Description                       |
| -------------- | -------- | --------------------------------- |
| `Id`           | `guid`   | Unique identifier                 |
| `Title`        | `string` | Ticket title                      |
| `Content`      | `string` | Ticket content                    |
| `Answer`       | `string` | Resolution or answer              |
| `CreatedById`  | `guid`   | Creator user identifier           |

#### PagedResult<T> (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)

| Property          | Type  | Description                                           |
| ----------------- | ----- | ----------------------------------------------------- |
| `Items`           | `T[]` | Page items                                            |
| `TotalPages`      | `int` | Total pages based on `TotalItemsCount` and `PageSize` |
| `TotalItemsCount` | `int` | Total number of items                                 |
| `ItemsFrom`       | `int` | Index of the first item in this page (1-based)        |
| `ItemsTo`         | `int` | Index of the last item in this page (1-based)         |

---

## Frontend Notes

- Authorization
  - All endpoints require `Admin` role.
- Creation flow
  - After `POST /api/Supports`, call `GET /api/Supports/{id}` to fetch the created ticket.
- Validation
  - Title required, max 100 characters.
  - Content required, max 1000 characters.
  - Answer optional, max 2000 characters.
- Sorting & pagination
  - Use `SortBy`, `SortDirection`, `PageNumber`, `PageSize` in `GET /api/Supports`.

