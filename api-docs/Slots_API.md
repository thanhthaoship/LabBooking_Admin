# SlotController API

## SlotController

- Controller: `SlotController`
- Purpose: Manage slot configuration (create, update, delete, list, retrieve)
- Base Route: `api/Slot` (`LabBooking\src\LabBooking.API\Controllers\SlotController.cs:10`)

### Endpoints

#### Get All Slots

- Method: `GET`
- Path: `api/Slot`
- Summary: Retrieve all slot configurations (`LabBooking\src\LabBooking.API\Controllers\SlotController.cs:17`).
- Authorization: `Admin, Manager, User`
- Input
- Output
  - Model: `IEnumerable<SlotResponse>` (`LabBooking\src\LabBooking.Application\Features\Slots\Dtos\SlotResponse.cs:3`)
  - Item Properties
    - `Id` (guid)
    - `StartTime` (time)
    - `EndTime` (time)
    - `SlotIndex` (int)
    - `Label` (string)
  - Example JSON
    ```json
    [
      {
        "id": "b9d5e0a7-6c2b-4f4d-9c33-5b7c2e3a1c11",
        "startTime": "08:00:00",
        "endTime": "10:00:00",
        "slotIndex": 1,
        "label": "Morning"
      }
    ]
    ```
- Response Status Codes
  - `200 OK`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Create Slot

- Method: `POST`
- Path: `api/Slot`
- Summary: Create a new slot configuration (`LabBooking\src\LabBooking.API\Controllers\SlotController.cs:34`).
- Authorization: `Admin`
- Input
  - Body Model: `CreateSlotCommand` (`LabBooking\src\LabBooking.Application\Features\Slots\Commands\CreateSlot\CreateSlotCommand.cs:9`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "StartTime": { "type": "string", "format": "time" },
        "EndTime": { "type": "string", "format": "time" },
        "SlotIndex": { "type": "integer", "minimum": 1, "maximum": 4 },
        "Label": { "type": "string" }
      },
      "required": ["StartTime", "EndTime", "SlotIndex", "Label"]
    }
    ```
- Output
  - Status: `201 Created`
  - Body: Created slot id (guid)
  - Example JSON
    ```json
    "b9d5e0a7-6c2b-4f4d-9c33-5b7c2e3a1c11"
    ```
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Update Slot

- Method: `PUT`
- Path: `api/Slot/{id}` where `{id}` is `guid`
- Summary: Update an existing slot configuration (`LabBooking\src\LabBooking.API\Controllers\SlotController.cs:55`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Slot identifier
  - Body Model: `UpdateSlotCommand` (`LabBooking\src\LabBooking.Application\Features\Slots\Commands\UpdateSlot\UpdateSlotCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "StartTime": { "type": "string", "format": "time" },
        "EndTime": { "type": "string", "format": "time" },
        "SlotIndex": { "type": "integer", "minimum": 1, "maximum": 4 },
        "Label": { "type": "string" }
      },
      "required": ["StartTime", "EndTime", "SlotIndex", "Label"]
    }
    ```
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`

#### Get Slot By Id

- Method: `GET`
- Path: `api/Slot/{id}` where `{id}` is `guid`
- Summary: Get a specific slot by Id (`LabBooking\src\LabBooking.API\Controllers\SlotController.cs:78`).
- Authorization: `Admin, Manager, User`
- Input
  - Route Parameters
    - `id` (guid): Slot identifier
- Output
  - Model: `SlotResponse`
  - Properties
    - `Id` (guid)
    - `StartTime` (time)
    - `EndTime` (time)
    - `SlotIndex` (int)
    - `Label` (string)
  - Example JSON
    ```json
    {
      "id": "b9d5e0a7-6c2b-4f4d-9c33-5b7c2e3a1c11",
      "startTime": "08:00:00",
      "endTime": "10:00:00",
      "slotIndex": 1,
      "label": "Morning"
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`

#### Delete Slot

- Method: `DELETE`
- Path: `api/Slot/{id}` where `{id}` is `guid`
- Summary: Delete an existing slot (`LabBooking\src\LabBooking.API\Controllers\SlotController.cs:99`).
- Authorization: `Admin`
- Input
  - Route Parameters
    - `id` (guid): Slot identifier
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`

### Response Models

#### SlotResponse (`LabBooking\src\LabBooking.Application\Features\Slots\Dtos\SlotResponse.cs:3`)

| Property    | Type     | Description       |
| ----------- | -------- | ----------------- |
| `Id`        | `guid`   | Unique identifier |
| `StartTime` | `time`   | Slot start time   |
| `EndTime`   | `time`   | Slot end time     |
| `SlotIndex` | `int`    | Slot index (1–4)  |
| `Label`     | `string` | Display label     |

---

## Frontend Notes

- Authorization
  - Read endpoints allowed for `Admin, Manager, User`. Writes require `Admin`.
- Validation
  - `SlotIndex` must be unique and between 1–4.
  - `Label` required, max length 50.
  - `EndTime` must be greater than `StartTime`.
- Update safety
  - `id` in route is authoritative; server overwrites body `Id` with route value.
- Time format
  - Send `StartTime` and `EndTime` as `HH:mm:ss` strings.
