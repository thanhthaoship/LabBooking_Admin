# LabRoomsController API

## LabRoomsController

- Controller: `LabRoomsController`
- Purpose: Manage lab room resources (create, update, delete, list, retrieve)
- Base Route: `api/LabRooms` (`LabBooking\src\LabBooking.API\Controllers\LabRoomsController.cs:5`)

### Endpoints

#### Create Lab Room

- Method: `POST`
- Path: `api/LabRooms`
- Summary: Create a new lab room (`LabBooking\src\LabBooking.API\Controllers\LabRoomsController.cs:11`)
- Authorization: `Admin` required (`[Authorize(Roles = "Admin")]`)
- Input
  - Body Model: `CreateLabRoomCommand`
  - JSON Schema
    ```json
    {
      "type": "object",
      "required": ["LabName"],
      "properties": {
        "LabName": { "type": "string" },
        "Location": { "type": "string", "nullable": true },
        "MaximumLimit": { "type": "integer", "nullable": true },
        "MainManagerId": {
          "type": "string",
          "format": "uuid",
          "nullable": true
        }
      }
    }
    ```
- Output
  - Status: `201 Created`
  - Body: none (Location header points to `GET api/LabRooms/{id}`) (`LabBooking\src\LabBooking.API\Controllers\LabRoomsController.cs:23`)
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Update Lab Room

- Method: `PUT`
- Path: `api/LabRooms/{id}` where `{id}` is `guid`
- Summary: Update an existing lab room (`LabBooking\src\LabBooking.API\Controllers\LabRoomsController.cs:30`)
- Authorization: `Admin` required
- Input
  - Route Parameters
    - `id` (guid): Lab room identifier
  - Body Model: `UpdateLabRoomCommand`
  - JSON Schema
    ```json
    {
      "type": "object",
      "required": ["LabName"],
      "properties": {
        "LabName": { "type": "string" },
        "Location": { "type": "string", "nullable": true },
        "MaximumLimit": { "type": "integer", "nullable": true },
        "MainManagerId": {
          "type": "string",
          "format": "uuid",
          "nullable": true
        },
        "IsActive": { "type": "boolean" }
      }
    }
    ```
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`, `500 InternalServerError`

#### Delete Lab Room

- Method: `DELETE`
- Path: `api/LabRooms/{id}` where `{id}` is `guid`
- Summary: Delete an existing lab room (`LabBooking\src\LabBooking.API\Controllers\LabRoomsController.cs:54`)
- Authorization: `Admin` required
- Input
  - Route Parameters
    - `id` (guid): Lab room identifier
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`, `500 InternalServerError`

#### Get All Lab Rooms

- Method: `GET`
- Path: `api/LabRooms`
- Summary: Retrieve lab rooms with optional filtering, sorting, and pagination (`LabBooking\src\LabBooking.API\Controllers\LabRoomsController.cs:74`)
- Authorization: None enforced (authorization attributes are commented out)
- Input
  - Query Parameters (`GetAllLabRoomsQuery`)
    - `SearchPhrase` (string, optional)
    - `PageNumber` (int, required; minimum `1`)
    - `PageSize` (int, required; allowed values: `5`, `10`, `15`, `30`) (`LabBooking\src\LabBooking.Application\Features\LabRooms\Queries\GetAllLabRooms\GetAllLabRoomsQueryValidator.cs:12`)
    - `SortBy` (string, optional; allowed: `LabName`, `Location`, `CreatedDate`) (`LabBooking\src\LabBooking.Infrastructure\Repositories\LabRoomRepository.cs:57`)
    - `SortDirection` (enum, required; `Ascending` or `Descending`) (`LabBooking\src\LabBooking.Domain\Constants\SortDirection.cs:3`)
- Output
  - Model: `PagedResult<LabRoomResponse>` (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)
  - Properties
    - `Items` (array of `LabRoomResponse`)
    - `TotalPages` (int)
    - `TotalItemsCount` (int)
    - `ItemsFrom` (int)
    - `ItemsTo` (int)
  - Example JSON
    ```json
    {
      "items": [
        {
          "id": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
          "labName": "Chemistry Lab A",
          "location": "Building 1, Floor 3",
          "maximumLimit": 24,
          "mainManagerId": "c2f0b2a1-2d46-4f16-8c9c-bc5a625f1d10",
          "createdById": "4aa924a6-7b3f-46e1-9f9d-0e1e5a6f4a12",
          "createdDate": "2025-11-20T12:45:00Z",
          "isActive": true,
          "equipments": [
            {
              "id": "5b9fc1f7-9a27-4a39-9d7a-213f3fb984cb",
              "equipmentName": "Microscope",
              "description": "High resolution",
              "isAvailable": true,
              "labRoomId": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
              "status": "Available"
            }
          ]
        }
      ],
      "totalPages": 10,
      "totalItemsCount": 100,
      "itemsFrom": 1,
      "itemsTo": 10
    }
    ```
- Response Status Codes
  - `200 OK`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Get Lab Room By Id

- Method: `GET`
- Path: `api/LabRooms/{id}` where `{id}` is `guid`
- Summary: Get a specific lab room by Id (`LabBooking\src\LabBooking.API\Controllers\LabRoomsController.cs:92`)
- Authorization: None enforced (authorization attributes are commented out)
- Input
  - Route Parameters
    - `id` (guid): Lab room identifier
- Output
  - Model: `LabRoomResponse`
  - Properties
    - `Id` (guid)
    - `LabName` (string)
    - `Location` (string, nullable)
    - `MaximumLimit` (int, nullable)
    - `MainManagerId` (guid, nullable)
    - `CreatedById` (guid, nullable)
    - `CreatedDate` (datetime)
    - `IsActive` (bool)
    - `Equipments` (array of `EquipmentResponse`, nullable)
  - Example JSON
    ```json
    {
      "id": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
      "labName": "Chemistry Lab A",
      "location": "Building 1, Floor 3",
      "maximumLimit": 24,
      "mainManagerId": "c2f0b2a1-2d46-4f16-8c9c-bc5a625f1d10",
      "createdById": "4aa924a6-7b3f-46e1-9f9d-0e1e5a6f4a12",
      "createdDate": "2025-11-20T12:45:00Z",
      "isActive": true,
      "equipments": [
        {
          "id": "5b9fc1f7-9a27-4a39-9d7a-213f3fb984cb",
          "equipmentName": "Microscope",
          "description": "High resolution",
          "isAvailable": true,
          "labRoomId": "b3f373e7-5f2d-4ae1-9f7a-2c62fd3e7b1b",
          "status": "Available"
        }
      ]
    }
    ```
- Response Status Codes
  - `200 OK`, `404 NotFound`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

### Response Models

#### LabRoomResponse (`LabBooking\src\LabBooking.Application\Features\LabRooms\Dtos\LabRoomResponse.cs:6`)

| Property        | Type                   | Description                     |
| --------------- | ---------------------- | ------------------------------- |
| `Id`            | `guid`                 | Unique identifier               |
| `LabName`       | `string`               | Lab room name                   |
| `Location`      | `string?`              | Location (nullable)             |
| `MaximumLimit`  | `int?`                 | Max capacity (nullable)         |
| `MainManagerId` | `guid?`                | Manager ID (nullable)           |
| `CreatedById`   | `guid?`                | Creator user ID (nullable)      |
| `CreatedDate`   | `datetime`             | Creation time (UTC)             |
| `IsActive`      | `bool`                 | Active flag                     |
| `Equipments`    | `EquipmentResponse[]?` | Associated equipment (nullable) |

---
