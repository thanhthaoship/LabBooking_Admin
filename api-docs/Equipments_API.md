# EquipmentsController API

## EquipmentsController

- Controller: `EquipmentsController`
- Purpose: Manage equipment resources (create, update, delete, list, retrieve)
- Base Route: `api/Equipments` (`LabBooking\src\LabBooking.API\Controllers\EquipmentsController.cs:6`)

### Endpoints

#### Create Equipment

- Method: `POST`
- Path: `api/Equipments`
- Summary: Create a new equipment (`LabBooking\src\LabBooking.API\Controllers\EquipmentsController.cs:11`)
- Authorization: `Admin` required
- Input
  - Body Model: `CreateEquipmentCommand`
  - JSON Schema
    ```json
    {
      "type": "object",
      "required": ["EquipmentName", "LabRoomId"],
      "properties": {
        "EquipmentName": { "type": "string" },
        "Description": { "type": "string", "nullable": true },
        "LabRoomId": { "type": "string", "format": "uuid" }
      }
    }
    ```
- Output
  - Status: `201 Created`
  - Body: none (Location header points to `GET api/Equipments/{id}`) (`LabBooking\src\LabBooking.API\Controllers\EquipmentsController.cs:21`)
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `500 InternalServerError`
- Notes
  - If `LabRoomId` does not exist, server will throw NotFound; ensure the lab room is created first (`LabBooking\src\LabBooking.Application\Features\Equipments\Commands\CreateEquipment\CreateEquipmentCommandHandler.cs:17`).
  - Equipment status defaults to `Available` on creation (`LabBooking\src\LabBooking.Domain\Entities\Equipment.cs:12`).

#### Update Equipment

- Method: `PUT`
- Path: `api/Equipments/{id}` where `{id}` is `guid`
- Summary: Update an existing equipment (`LabBooking\src\LabBooking.API\Controllers\EquipmentsController.cs:28`)
- Authorization: `Admin` required
- Input
  - Route Parameters
    - `id` (guid): Equipment identifier
  - Body Model: `UpdateEquipmentCommand`
  - JSON Schema
    ```json
    {
      "type": "object",
      "required": ["EquipmentName", "LabRoomId", "Status"],
      "properties": {
        "EquipmentName": { "type": "string" },
        "Description": { "type": "string", "nullable": true },
        "IsAvailable": { "type": "boolean" },
        "LabRoomId": { "type": "string", "format": "uuid" },
        "Status": {
          "type": "string",
          "enum": ["Maintain", "Available", "Broken", "Other"]
        }
      }
    }
    ```
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `404 NotFound`, `500 InternalServerError`
- Notes
  - `id` is taken from the route; do not include it in body (`LabBooking\src\LabBooking.Application\Features\Equipments\Commands\UpdateEquipment\UpdateEquipmentCommand.cs:10`).
  - `Status` must match the `EquipmentStatus` enum names exactly (`LabBooking\src\LabBooking.Domain\Entities\Equipment.cs:13`).
  - Returns `404 NotFound` if equipment or target lab room does not exist (`LabBooking\src\LabBooking.Application\Features\Equipments\Commands\UpdateEquipment\UpdateEquipmentCommandHandler.cs:17`).

#### Get Equipment By Id

- Method: `GET`
- Path: `api/Equipments/{id}` where `{id}` is `guid`
- Summary: Get a specific equipment by Id (`LabBooking\src\LabBooking.API\Controllers\EquipmentsController.cs:50`)
- Authorization: `Admin` required
- Input
  - Route Parameters
    - `id` (guid): Equipment identifier
- Output
  - Model: `EquipmentResponse`
  - Properties
    - `Id` (guid)
    - `EquipmentName` (string)
    - `Description` (string, nullable)
    - `IsAvailable` (bool)
    - `LabRoomId` (guid)
    - `Status` (enum `EquipmentStatus`)
  - Example JSON
    ```json
    {
      "id": "5b9fc1f7-9a27-4a39-9d7a-213f3fb984cb",
      "equipmentName": "Microscope",
      "description": "High resolution",
      "isAvailable": true,
      "labRoomId": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
      "status": "Available"
    }
    ```
- Response Status Codes
  - `200 OK`, `404 NotFound`, `500 InternalServerError`

#### Get All Equipments

- Method: `GET`
- Path: `api/Equipments`
- Summary: Retrieve equipments with optional filtering, sorting, and pagination (`LabBooking\src\LabBooking.API\Controllers\EquipmentsController.cs:68`)
- Authorization: `Admin` required
- Input
  - Query Parameters (`GetAllEquipmentsQuery`)
    - `SearchPhrase` (string, optional)
    - `PageNumber` (int, required; minimum `1`)
    - `PageSize` (int, required)
    - `SortBy` (string, optional; allowed: `EquipmentName`, `Status`, `IsAvailable`, `LabRoomId`) (`LabBooking\src\LabBooking.Infrastructure\Repositories\EquipmentRepository.cs:53`)
    - `SortDirection` (enum, required; `Ascending` or `Descending`) (`LabBooking\src\LabBooking.Domain\Constants\SortDirection.cs:3`)
- Output
  - Model: `PagedResult<EquipmentResponse>`
  - Properties
    - `Items` (array of `EquipmentResponse`)
    - `TotalPages` (int)
    - `TotalItemsCount` (int)
    - `ItemsFrom` (int)
    - `ItemsTo` (int)
  - Example JSON
    ```json
    {
      "items": [
        {
          "id": "5b9fc1f7-9a27-4a39-9d7a-213f3fb984cb",
          "equipmentName": "Microscope",
          "description": "High resolution",
          "isAvailable": true,
          "labRoomId": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
          "status": "Available"
        }
      ],
      "totalPages": 5,
      "totalItemsCount": 50,
      "itemsFrom": 1,
      "itemsTo": 10
    }
    ```
- Response Status Codes
  - `200 OK`, `400 BadRequest`, `500 InternalServerError`

#### Delete Equipment

- Method: `DELETE`
- Path: `api/Equipments/{id}` where `{id}` is `guid`
- Summary: Delete an existing equipment (`LabBooking\src\LabBooking.API\Controllers\EquipmentsController.cs:84`)
- Authorization: `Admin` required
- Input
  - Route Parameters
    - `id` (guid): Equipment identifier
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `404 NotFound`, `500 InternalServerError`

### Response Models

#### EquipmentResponse (`LabBooking\src\LabBooking.Application\Features\Equipments\Dtos\EquipmentResponse.cs:6`)

| Property        | Type              | Description            |
| --------------- | ----------------- | ---------------------- |
| `Id`            | `guid`            | Unique identifier      |
| `EquipmentName` | `string`          | Equipment name         |
| `Description`   | `string?`         | Description (nullable) |
| `IsAvailable`   | `bool`            | Availability flag      |
| `LabRoomId`     | `guid`            | Owning lab room        |
| `Status`        | `EquipmentStatus` | Current status         |

#### EquipmentStatus Enum (`LabBooking\src\LabBooking.Domain\Entities\Equipment.cs:14`)

```csharp
public enum EquipmentStatus
{
    Maintain,
    Available,
    Broken,
    Other
}
```

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
  - Most LabRooms endpoints are public for read (`GetAll`, `GetById`), writes require `Admin`.
  - All Equipments endpoints require `Admin`.
- Enum handling
  - For equipment updates, send `Status` as one of: `Maintain`, `Available`, `Broken`, `Other`.
- Defaults
  - New equipment defaults to `Status = Available` and `IsAvailable = true` unless changed server-side.
- Sorting parameters
  - LabRooms `SortBy`: `LabName`, `Location`, `CreatedDate`.
  - Equipments `SortBy`: `EquipmentName`, `Status`, `IsAvailable`, `LabRoomId`.
- Pagination
  - LabRooms `PageSize` must be one of `5`, `10`, `15`, `30`.
- Error cases
  - Updates may return `404 NotFound` if target resource or related lab room is missing.
  - Create equipment will fail if `LabRoomId` is invalid.
