# UsagePoliciesController API

## UsagePoliciesController

- Controller: `UsagePoliciesController`
- Purpose: Manage usage policies (create, update, delete, list, retrieve)
- Base Route: `api/UsagePolicies` (`LabBooking\src\LabBooking.API\Controllers\UsagePoliciesController.cs:10`)

### Endpoints

#### Create Usage Policy

- Method: `POST`
- Path: `api/UsagePolicies`
- Summary: Create a new usage policy (`LabBooking\src\LabBooking.API\Controllers\UsagePoliciesController.cs:19`).
- Authorization: `Admin`
- Input
  - Body Model: `CreateUsagePolicyCommand` (`LabBooking\src\LabBooking.Application\Features\UsagePolicies\Commands\CreateUsagePolicy\CreateUsagePolicyCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "Title": { "type": "string" },
        "Description": { "type": "string", "nullable": true },
        "ForAllLabRooms": { "type": "boolean" },
        "LabRoomId": { "type": "string", "format": "uuid", "nullable": true },
        "EffectiveFrom": { "type": "string", "format": "date-time", "nullable": true },
        "ExpirationDate": { "type": "string", "format": "date-time", "nullable": true }
      },
      "required": ["Title", "ForAllLabRooms"]
    }
    ```
- Output
  - Status: `201 Created`
  - Body: none (Location header points to `GET api/UsagePolicies/{id}`)
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`
- Notes
  - When `ForAllLabRooms` is `true`, `LabRoomId` must be `null`; when `false`, `LabRoomId` must be provided (business rule documented in command XML docs).

#### Update Usage Policy

- Method: `PUT`
- Path: `api/UsagePolicies/{id}` where `{id}` is `guid`
- Summary: Update an existing usage policy (`LabBooking\src\LabBooking.API\Controllers\UsagePoliciesController.cs:38`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Usage policy identifier
  - Body Model: `UpdateUsagePolicyCommand` (`LabBooking\src\LabBooking.Application\Features\UsagePolicies\Commands\UpdateUsagePolicy\UpdateUsagePolicyCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "Title": { "type": "string" },
        "Description": { "type": "string", "nullable": true },
        "ForAllLabRooms": { "type": "boolean" },
        "LabRoomId": { "type": "string", "format": "uuid", "nullable": true },
        "EffectiveFrom": { "type": "string", "format": "date-time", "nullable": true },
        "ExpirationDate": { "type": "string", "format": "date-time", "nullable": true },
        "IsActive": { "type": "boolean" }
      },
      "required": ["Title", "ForAllLabRooms"]
    }
    ```
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`, `500 InternalServerError`
- Notes
  - Server sets `command.Id = id` from route (`LabBooking\src\LabBooking.API\Controllers\UsagePoliciesController.cs:50`).

#### Get Usage Policy By Id

- Method: `GET`
- Path: `api/UsagePolicies/{id}` where `{id}` is `guid`
- Summary: Get a specific usage policy by Id (`LabBooking\src\LabBooking.API\Controllers\UsagePoliciesController.cs:61`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Usage policy identifier
- Output
  - Model: `UsagePolicyResponse` (`LabBooking\src\LabBooking.Application\Features\UsagePolicies\Dtos\UsagePolicyResponse.cs:5`)
  - Properties
    - `Id` (guid)
    - `Title` (string)
    - `Description` (string, nullable)
    - `IsActive` (bool)
    - `ForAllLabRooms` (bool)
    - `LabRoomId` (guid, nullable)
    - `EffectiveFrom` (datetime, nullable)
    - `ExpirationDate` (datetime, nullable)
    - `CreatedDate` (datetime)
    - `LastUpdatedDate` (datetime, nullable)
  - Example JSON
    ```json
    {
      "id": "b7d5e0a7-6c2b-4f4d-9c33-5b7c2e3a1c22",
      "title": "No Food or Drinks",
      "description": "Food and drinks are not allowed in any lab.",
      "isActive": true,
      "forAllLabRooms": true,
      "labRoomId": null,
      "effectiveFrom": "2025-11-01T00:00:00Z",
      "expirationDate": null,
      "createdDate": "2025-11-20T12:45:00Z",
      "lastUpdatedDate": null
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`, `500 InternalServerError`

#### Get All Usage Policies

- Method: `GET`
- Path: `api/UsagePolicies`
- Summary: Retrieve usage policies with optional filtering, sorting, and pagination (`LabBooking\src\LabBooking.API\Controllers\UsagePoliciesController.cs:82`).
- Authorization: `Admin`
- Input
  - Query Parameters (`GetAllUsagePoliciesQuery`) (`LabBooking\src\LabBooking.Application\Features\UsagePolicies\Queries\GetAllUsagePolicies\GetAllUsagePoliciesQuery.cs:9`)
    - `SearchPhrase` (string, optional)
    - `IsActive` (boolean, optional)
    - `PageNumber` (int)
    - `PageSize` (int)
    - `SortBy` (string, optional)
    - `SortDirection` (string; `Ascending` or `Descending`)
- Output
  - Model: `PagedResult<UsagePolicyResponse>`
  - Properties
    - `Items` (array of `UsagePolicyResponse`)
    - `TotalPages` (int)
    - `TotalItemsCount` (int)
    - `ItemsFrom` (int)
    - `ItemsTo` (int)
  - Example JSON
    ```json
    {
      "items": [
        {
          "id": "b7d5e0a7-6c2b-4f4d-9c33-5b7c2e3a1c22",
          "title": "No Food or Drinks",
          "description": "Food and drinks are not allowed in any lab.",
          "isActive": true,
          "forAllLabRooms": true,
          "labRoomId": null,
          "effectiveFrom": "2025-11-01T00:00:00Z",
          "expirationDate": null,
          "createdDate": "2025-11-20T12:45:00Z",
          "lastUpdatedDate": null
        }
      ],
      "totalPages": 4,
      "totalItemsCount": 40,
      "itemsFrom": 1,
      "itemsTo": 10
    }
    ```
- Response Status Codes
  - `200 OK`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Delete Usage Policy

- Method: `DELETE`
- Path: `api/UsagePolicies/{id}` where `{id}` is `guid`
- Summary: Delete an existing usage policy (`LabBooking\src\LabBooking.API\Controllers\UsagePoliciesController.cs:101`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Usage policy identifier
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`, `500 InternalServerError`

### Response Models

#### UsagePolicyResponse (`LabBooking\src\LabBooking.Application\Features\UsagePolicies\Dtos\UsagePolicyResponse.cs:5`)

| Property           | Type        | Description                                 |
| ------------------ | ----------- | ------------------------------------------- |
| `Id`               | `guid`      | Unique identifier                           |
| `Title`            | `string?`   | Title of the policy                         |
| `Description`      | `string?`   | Description (nullable)                      |
| `IsActive`         | `bool`      | Active status                               |
| `ForAllLabRooms`   | `bool`      | Applies to all labs when true               |
| `LabRoomId`        | `guid?`     | Target lab room ID (nullable)               |
| `EffectiveFrom`    | `datetime?` | Start date/time (nullable)                  |
| `ExpirationDate`   | `datetime?` | End date/time (nullable)                    |
| `CreatedDate`      | `datetime`  | Creation time (UTC)                         |
| `LastUpdatedDate`  | `datetime?` | Last update time (UTC, nullable)            |

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
- Business rules
  - `ForAllLabRooms = true` -> `LabRoomId` must be `null`.
  - `ForAllLabRooms = false` -> `LabRoomId` must be provided.
- Update behavior
  - Route `id` is authoritative; server assigns it to the command.
- Dates
  - Send date/time fields as ISO 8601; server stores UTC times.

