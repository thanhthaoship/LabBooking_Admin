# EquipmentMaintainSchedulesController API

## EquipmentMaintainSchedulesController

- Controller: `EquipmentMaintainSchedulesController`
- Purpose: Manage equipment maintenance schedules (create, list, get, update, delete)
- Base Route: `api/EquipmentMaintainSchedules` (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:11`)

### Endpoints

#### Create Equipment Maintain Schedule

- Method: `POST`
- Path: `api/EquipmentMaintainSchedules`
- Summary: Create a new equipment maintain schedule (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:25`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:19`)
- Input
  - Body Model: `CreateEquipmentMaintainScheduleCommand` (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Commands\CreateEquipmentMaintainSchedule\CreateEquipmentMaintainScheduleCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "EquipmentId": { "type": "string", "format": "uuid" },
        "IsManyDay": { "type": "boolean" },
        "IsAllDay": { "type": "boolean" },
        "StartTime": { "type": "string", "format": "date-time" },
        "EndTime": { "type": "string", "format": "date-time" },
        "NumberOfSlot": { "type": "integer", "minimum": 1 },
        "Description": { "type": "string", "maxLength": 1000 }
      },
      "required": ["EquipmentId", "IsManyDay"]
    }
    ```
- Validation
  - `EquipmentId` required and must exist (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Commands\CreateEquipmentMaintainSchedule\CreateEquipmentMaintainScheduleCommandValidator.cs:13-16, 38-42`).
  - `EndTime` must be after `StartTime` when both provided (`…CreateEquipmentMaintainScheduleCommandValidator.cs:19-22`).
  - `NumberOfSlot` > 0 when provided (`…CreateEquipmentMaintainScheduleCommandValidator.cs:24-28`).
  - `Description` max length 1000 (`…CreateEquipmentMaintainScheduleCommandValidator.cs:30-32`).
- Output
  - Status: `200 OK` with body `{ "id": "<new-schedule-id>" }` (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:31-32`).
- Response Status Codes
  - Declared: `201 Created`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError` (`…Controller.cs:20-24`).
  - Current behavior: `200 OK` returning id (temporary until `CreatedAtAction` is wired).
- Notes
  - Default status `EquimentpMaintainStatus` set to `NotYet` on creation (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Commands\CreateEquipmentMaintainSchedule\CreateEquipmentMaintainScheduleCommandHandler.cs:19`).

#### Update Equipment Maintain Schedule

- Method: `PUT`
- Path: `api/EquipmentMaintainSchedules/{id}`
- Summary: Update an existing equipment maintain schedule (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:48-57`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:41`)
- Input
  - Route Param: `id` (guid)
  - Body Model: `UpdateEquipmentMaintainScheduleCommand` (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Commands\UpdateEquipmentMaintainSchedule\UpdateEquipmentMaintainScheduleCommand.cs:8`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "EquipmentId": { "type": "string", "format": "uuid" },
        "IsManyDay": { "type": "boolean" },
        "IsAllDay": { "type": "boolean" },
        "StartTime": { "type": "string", "format": "date-time" },
        "EndTime": { "type": "string", "format": "date-time" },
        "NumberOfSlot": { "type": "integer", "minimum": 1 },
        "EquimentpMaintainStatus": {
          "type": "string",
          "enum": ["Done", "NotYet"]
        },
        "Description": { "type": "string", "maxLength": 1000 }
      },
      "required": ["EquipmentId", "IsManyDay", "EquimentpMaintainStatus"]
    }
    ```
  - Notes: `Id` is set from route and ignored in JSON (`JsonIgnore`) (`…UpdateEquipmentMaintainScheduleCommand.cs:13-14`).
- Validation
  - Same as Create for `EquipmentId`, date ordering, `NumberOfSlot`, `Description` (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Commands\UpdateEquipmentMaintainSchedule\UpdateEquipmentMaintainScheduleCommandValidator.cs:12-31`).
  - `EquimentpMaintainStatus` required and must be a valid enum (`…UpdateEquipmentMaintainScheduleCommandValidator.cs:34-36`).
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `404 NotFound`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Delete Equipment Maintain Schedule

- Method: `DELETE`
- Path: `api/EquipmentMaintainSchedules/{id}`
- Summary: Delete an existing equipment maintain schedule (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:71-77`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:65`)
- Input
  - Route Param: `id` (guid)
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `404 NotFound`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Get Equipment Maintain Schedule By Id

- Method: `GET`
- Path: `api/EquipmentMaintainSchedules/{id}`
- Summary: Get a specific equipment maintain schedule by id (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:91-97`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:85`)
- Input
  - Route Param: `id` (guid)
- Output
  - Model: `EquipmentMaintainScheduleResponse`
- Response Status Codes
  - `200 OK`, `404 NotFound`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Get All Equipment Maintain Schedules

- Method: `GET`
- Path: `api/EquipmentMaintainSchedules`
- Summary: Paged list with filtering and sorting (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:111-115`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\EquipmentMaintainSchedulesController.cs:105`)
- Input (Query Params) — `GetAllEquipmentMaintainSchedulesQuery` (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Queries\GetAllEquipmentMaintainSchedules\GetAllEquipmentMaintainSchedulesQuery.cs:6`)
  - `SearchPhrase` (string, optional)
  - `Status` (`EquimentpMaintainStatus`, optional: `Done`, `NotYet`) (`…GetAllEquipmentMaintainSchedulesQuery.cs:13`)
  - `PageNumber` (int, >= 1) (`…GetAllEquipmentMaintainSchedulesQueryValidator.cs:19-21`)
  - `PageSize` (int, one of `5,10,15,30`) (`…GetAllEquipmentMaintainSchedulesQueryValidator.cs:23-26`)
  - `SortBy` (string, optional: `StartTime`, `EndTime`, `EquimentpMaintainStatus`) (`…GetAllEquipmentMaintainSchedulesQueryValidator.cs:9-16, 31-35`)
  - `SortDirection` (`Ascending` or `Descending`)
- Output
  - Model: `PagedResult<EquipmentMaintainScheduleResponse>`
- Response Status Codes
  - `200 OK`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

### Request Models

#### CreateEquipmentMaintainScheduleCommand (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Commands\CreateEquipmentMaintainSchedule\CreateEquipmentMaintainScheduleCommand.cs:5`)

| Property       | Type        | Description                                     |
| -------------- | ----------- | ----------------------------------------------- |
| `EquipmentId`  | `guid`      | Target equipment; must exist                    |
| `IsManyDay`    | `bool`      | Whether the schedule spans multiple days        |
| `IsAllDay`     | `bool?`     | Whether maintenance lasts all day               |
| `StartTime`    | `datetime?` | Start time (required by entity in practice)     |
| `EndTime`      | `datetime?` | End time; must be after `StartTime` if provided |
| `NumberOfSlot` | `int?`      | Number of slots; must be > 0 if provided        |
| `Description`  | `string?`   | Optional notes, up to 1000 chars                |

#### UpdateEquipmentMaintainScheduleCommand (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Commands\UpdateEquipmentMaintainSchedule\UpdateEquipmentMaintainScheduleCommand.cs:16`)

| Property                  | Type                      | Description                                  |
| ------------------------- | ------------------------- | -------------------------------------------- |
| `Id` (route)              | `guid`                    | Schedule id; set from route; ignored in JSON |
| `EquipmentId`             | `guid`                    | Target equipment; must exist                 |
| `IsManyDay`               | `bool`                    | Multi-day flag                               |
| `IsAllDay`                | `bool?`                   | All day flag                                 |
| `StartTime`               | `datetime?`               | Start time                                   |
| `EndTime`                 | `datetime?`               | End time; must be after start time           |
| `NumberOfSlot`            | `int?`                    | Slot count; must be > 0                      |
| `EquimentpMaintainStatus` | `EquimentpMaintainStatus` | Enum; required; one of `Done`, `NotYet`      |
| `Description`             | `string?`                 | Notes, up to 1000 chars                      |

### Response Models

#### EquipmentMaintainScheduleResponse (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Dtos\EquipmentMaintainScheduleResponse.cs:6`)

| Property                  | Type        | Description                           |
| ------------------------- | ----------- | ------------------------------------- |
| `Id`                      | `guid`      | Unique identifier                     |
| `EquipmentId`             | `guid`      | Equipment id                          |
| `IsManyDay`               | `bool`      | Multi-day flag                        |
| `IsAllDay`                | `bool?`     | All day flag                          |
| `StartTime`               | `datetime?` | Start time                            |
| `EndTime`                 | `datetime?` | End time                              |
| `NumberOfSlot`            | `int?`      | Number of slots                       |
| `EquimentpMaintainStatus` | `string?`   | Status as string (`Done` or `NotYet`) |
| `Description`             | `string?`   | Notes                                 |

#### PagedResult<T> (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)

| Property          | Type  | Description                                           |
| ----------------- | ----- | ----------------------------------------------------- |
| `Items`           | `T[]` | Page items                                            |
| `TotalPages`      | `int` | Total pages based on `TotalItemsCount` and `PageSize` |
| `TotalItemsCount` | `int` | Total number of items                                 |
| `ItemsFrom`       | `int` | First item index in this page (1-based)               |
| `ItemsTo`         | `int` | Last item index in this page (1-based)                |

### Notes

- Enum: `EquimentpMaintainStatus` with values `Done`, `NotYet` (`LabBooking\src\LabBooking.Domain\Entities\EquipmentMaintainSchedule.cs:20-24`).
- On create, status defaults to `NotYet` (`…CreateEquipmentMaintainScheduleCommandHandler.cs:19`).
- Response DTO maps enum to string for API output (`LabBooking\src\LabBooking.Application\Features\EquipmentMaintainSchedules\Dtos\EquipmentMaintainScheduleProfile.cs:12-17`).
