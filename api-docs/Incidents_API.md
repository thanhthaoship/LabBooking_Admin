# IncidentsController API

## IncidentsController

- Controller: `IncidentsController`
- Purpose: Manage incidents (list with filtering, create, cache maintenance)
- Base Route: `api/Incidents` (`LabBooking\src\LabBooking.API\Controllers\IncidentsController.cs:3`)

### Endpoints

#### Get All Incidents

- Method: `GET`
- Path: `api/Incidents`
- Summary: Retrieve incidents with optional filtering, sorting, and pagination (`LabBooking\src\LabBooking.API\Controllers\IncidentsController.cs:16`).
- Authorization: None explicitly on controller
- Input
  - Query Parameters (`GetAllIncidentsQuery`) (`LabBooking\src\LabBooking.Application\Features\Incidents\Queries\GetAllIncidents\GetAllIncidentsQuery.cs:3`)
    - `SearchPhrase` (string, optional)
    - `PageNumber` (int)
    - `PageSize` (int)
    - `SortBy` (string, optional; allowed includes `Description` per repository selector)
    - `SortDirection` (string; `Ascending` or `Descending`)
- Output
  - Model: `PagedResult<IncidentsResponse>`
  - Properties
    - `Items` (array of `IncidentsResponse`)
    - `TotalPages` (int)
    - `TotalItemsCount` (int)
    - `ItemsFrom` (int)
    - `ItemsTo` (int)
  - Example JSON
    ```json
    {
      "items": [
        {
          "id": "c9d1b2f0-8c9c-4e0a-9b3c-ef2b7f3f0a12",
          "labRoomId": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
          "reportedById": "4aa924a6-7b3f-46e1-9f9d-0e1e5a6f4a12",
          "type": "Fire",
          "description": "Small fire in lab room",
          "isResolved": false,
          "createdAt": "2025-11-23T10:15:00Z"
        }
      ],
      "totalPages": 2,
      "totalItemsCount": 20,
      "itemsFrom": 1,
      "itemsTo": 10
    }
    ```
- Response Status Codes
  - `200 OK`, `400 BadRequest`, `500 InternalServerError`
- Notes
  - Responses are cached for 10 minutes using key `get_all_incidents` (`LabBooking\src\LabBooking.API\Controllers\IncidentsController.cs:22-26`).

#### Create Incident

- Method: `POST`
- Path: `api/Incidents`
- Summary: Creates a new incident and returns the created record (`LabBooking\src\LabBooking.API\Controllers\IncidentsController.cs:36`).
- Authorization: None explicitly on controller
- Input
  - Body Model: `CreateIncidentCommand` (`LabBooking\src\LabBooking.Application\Features\Incidents\Commands\CreateIncident\CreateIncidentCommand.cs:9`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "LabRoomId": { "type": "string", "format": "uuid" },
        "ReportedById": { "type": "string", "format": "uuid" },
        "Type": {
          "type": "string",
          "description": "Incident type (e.g., Fire, PowerOutage)"
        },
        "Description": { "type": "string" }
      },
      "required": ["LabRoomId", "ReportedById", "Type", "Description"]
    }
    ```
- Output
  - Model: `IncidentsResponse` (`LabBooking\src\LabBooking.Application\Features\Incidents\Dtos\IncidentsResponse.cs:3`)
  - Properties
    - `Id` (guid)
    - `LabRoomId` (guid)
    - `ReportedById` (guid)
    - `Type` (enum `IncidentType`)
    - `Description` (string)
    - `IsResolved` (bool)
    - `CreatedAt` (datetime)
  - Example JSON
    ```json
    {
      "id": "c9d1b2f0-8c9c-4e0a-9b3c-ef2b7f3f0a12",
      "labRoomId": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
      "reportedById": "4aa924a6-7b3f-46e1-9f9d-0e1e5a6f4a12",
      "type": "Fire",
      "description": "Small fire in lab room",
      "isResolved": false,
      "createdAt": "2025-11-23T10:15:00Z"
    }
    ```
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `500 InternalServerError`
- Notes
  - On successful creation, the incidents cache (`get_all_incidents`) is invalidated (`LabBooking\src\LabBooking.API\Controllers\IncidentsController.cs:43`).

#### Clear All Incidents Cache (Internal)

- Method: `DELETE`
- Path: `api/Incidents/clear-all-incidents-cache`
- Summary: Clears the cached incidents list; hidden from API explorer (`LabBooking\src\LabBooking.API\Controllers\IncidentsController.cs:48-53`).
- Authorization: None explicitly on controller
- Input: None
- Output
  - Status: `200 OK`
  - Body: Confirmation message
  - Example JSON
    ```json
    "Cache with key 'get_all_incidents' has been cleared."
    ```

### Response Models

#### IncidentsResponse (`LabBooking\src\LabBooking.Application\Features\Incidents\Dtos\IncidentsResponse.cs:3`)

| Property       | Type           | Description                      |
| -------------- | -------------- | -------------------------------- |
| `Id`           | `guid`         | Unique identifier                |
| `LabRoomId`    | `guid`         | Lab room where incident occurred |
| `ReportedById` | `guid`         | Reporter user identifier         |
| `Type`         | `IncidentType` | Type of incident                 |
| `Description`  | `string`       | Detailed description             |
| `IsResolved`   | `bool`         | Resolution status                |
| `CreatedAt`    | `datetime`     | Creation time (UTC)              |

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

- Caching
  - `GET /api/Incidents` is cached for 10 minutes; expect slightly stale data.
  - `POST /api/Incidents` clears the cache; subsequent GET returns fresh data.
- Sorting
  - `SortBy` supports `Description` (per repository selector). If omitted, default ordering applies.
- Types
  - `Type` must match the server `IncidentType` enum names.
