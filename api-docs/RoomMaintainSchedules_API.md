# RoomMaintainSchedulesController API

## RoomMaintainSchedulesController

- Controller: `RoomMaintainSchedulesController`
- Purpose: Manage lab room maintenance schedules (create, list, get, update, delete)
- Base Route: `api/RoomMaintainSchedules` (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:10`)

### Endpoints

#### Create Room Maintain Schedule

- Method: `POST`
- Path: `api/RoomMaintainSchedules`
- Summary: Create a new room maintain schedule (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:24`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:18`)
- Input
  - Body Model: `CreateRoomMaintainScheduleCommand` (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Commands\CreateRoomMaintainSchedule\CreateRoomMaintainScheduleCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "LabRoomId": { "type": "string", "format": "uuid" },
        "IsManyDay": { "type": "boolean" },
        "IsAllDay": { "type": "boolean" },
        "StartTime": { "type": "string", "format": "date-time" },
        "EndTime": { "type": "string", "format": "date-time" },
        "NumberOfSlot": { "type": "integer", "minimum": 1 },
        "Description": { "type": "string", "maxLength": 1000 }
      },
      "required": ["LabRoomId", "IsManyDay"]
    }
    ```
- Validation
  - `LabRoomId` required and must exist (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Commands\CreateRoomMaintainSchedule\CreateRoomMaintainScheduleCommandValidator.cs:12-15, 37-41`).
  - `EndTime` must be after `StartTime` when both provided (`…CreateRoomMaintainScheduleCommandValidator.cs:18-21`).
  - `NumberOfSlot` > 0 when provided (`…CreateRoomMaintainScheduleCommandValidator.cs:24-27`).
  - `Description` max length 1000 (`…CreateRoomMaintainScheduleCommandValidator.cs:30-31`).
- Output
  - Status: `201 Created`
  - Location: `GetById` with `id` (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:30`).
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`
- Notes
  - Default `RoomMaintainStatus` set to `NotYet` at creation (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Commands\CreateRoomMaintainSchedule\CreateRoomMaintainScheduleCommandHandler.cs:20`).

#### Get All Room Maintain Schedules

- Method: `GET`
- Path: `api/RoomMaintainSchedules`
- Summary: Paged list with filtering and sorting (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:45`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:39`)
- Input (Query Params) — `GetAllRoomMaintainSchedulesQuery` (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Queries\GetAllRoomMaintainSchedules\GetAllRoomMaintainSchedulesQuery.cs:12`)
  - `SearchPhrase` (string, optional)
  - `Status` (`RoomMaintainStatus`, optional: `Done`, `NotYet`) (`…GetAllRoomMaintainSchedulesQuery.cs:21`)
  - `PageNumber` (int, >= 1) (`…GetAllRoomMaintainSchedulesQueryValidator.cs:22-24`)
  - `PageSize` (int, one of `5,10,15,30`) (`…GetAllRoomMaintainSchedulesQueryValidator.cs:26-29`)
  - `SortBy` (string, optional: `StartTime`, `EndTime`, `RoomMaintainStatus`) (`…GetAllRoomMaintainSchedulesQueryValidator.cs:10-17, 32-36`)
  - `SortDirection` (`Ascending` or `Descending`)
- Output
  - Model: `PagedResult<RoomMaintainScheduleResponse>`
  - Response Status Codes: `200 OK`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Get By Id

- Method: `GET`
- Path: `api/RoomMaintainSchedules/{id}`
- Summary: Get a specific room maintain schedule by id (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:108`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:102`)
- Input
  - Route Param: `id` (guid)
- Output
  - Model: `RoomMaintainScheduleResponse`
  - Response Status Codes: `200 OK`, `404 NotFound`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Update Room Maintain Schedule

- Method: `PUT`
- Path: `api/RoomMaintainSchedules/{id}`
- Summary: Update an existing schedule (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:85`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:78`)
- Input
  - Route Param: `id` (guid)
  - Body Model: `UpdateRoomMaintainScheduleCommand` (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Commands\UpdateRoomMaintainSchedule\UpdateRoomMaintainScheduleCommand.cs:8`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "LabRoomId": { "type": "string", "format": "uuid" },
        "IsManyDay": { "type": "boolean" },
        "IsAllDay": { "type": "boolean" },
        "StartTime": { "type": "string", "format": "date-time" },
        "EndTime": { "type": "string", "format": "date-time" },
        "NumberOfSlot": { "type": "integer", "minimum": 1 },
        "RoomMaintainStatus": { "type": "string", "enum": ["Done", "NotYet"] },
        "Description": { "type": "string", "maxLength": 1000 }
      },
      "required": ["LabRoomId", "IsManyDay", "RoomMaintainStatus"]
    }
    ```
  - Notes: `Id` is set from route and ignored in JSON (`JsonIgnore`) (`…UpdateRoomMaintainScheduleCommand.cs:13-14`).
- Validation
  - Same as Create for `LabRoomId`, date ordering, `NumberOfSlot`, `Description` (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Commands\UpdateRoomMaintainSchedule\UpdateRoomMaintainScheduleCommandValidator.cs:12-31`).
  - `RoomMaintainStatus` required and must be a valid enum (`…UpdateRoomMaintainScheduleCommandValidator.cs:34-36`).
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `404 NotFound`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

#### Delete Room Maintain Schedule

- Method: `DELETE`
- Path: `api/RoomMaintainSchedules/{id}`
- Summary: Delete an existing schedule (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:63-69`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\RoomMaintainSchedulesController.cs:57`)
- Input
  - Route Param: `id` (guid)
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `404 NotFound`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`

### Request Models

#### CreateRoomMaintainScheduleCommand (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Commands\CreateRoomMaintainSchedule\CreateRoomMaintainScheduleCommand.cs:5`)

| Property       | Type        | Description                                     |
| -------------- | ----------- | ----------------------------------------------- |
| `LabRoomId`    | `guid`      | Target lab room; must exist                     |
| `IsManyDay`    | `bool`      | Whether the schedule spans multiple days        |
| `IsAllDay`     | `bool?`     | Whether maintenance lasts all day               |
| `StartTime`    | `datetime?` | Start time (required by entity in practice)     |
| `EndTime`      | `datetime?` | End time; must be after `StartTime` if provided |
| `NumberOfSlot` | `int?`      | Number of slots; must be > 0 if provided        |
| `Description`  | `string?`   | Optional notes, up to 1000 chars                |

#### UpdateRoomMaintainScheduleCommand (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Commands\UpdateRoomMaintainSchedule\UpdateRoomMaintainScheduleCommand.cs:16`)

| Property             | Type                 | Description                                  |
| -------------------- | -------------------- | -------------------------------------------- |
| `Id` (route)         | `guid`               | Schedule id; set from route; ignored in JSON |
| `LabRoomId`          | `guid`               | Target lab room; must exist                  |
| `IsManyDay`          | `bool`               | Multi-day flag                               |
| `IsAllDay`           | `bool?`              | All day flag                                 |
| `StartTime`          | `datetime?`          | Start time                                   |
| `EndTime`            | `datetime?`          | End time; must be after start time           |
| `NumberOfSlot`       | `int?`               | Slot count; must be > 0                      |
| `RoomMaintainStatus` | `RoomMaintainStatus` | Enum; required; one of `Done`, `NotYet`      |
| `Description`        | `string?`            | Notes, up to 1000 chars                      |

### Response Models

#### RoomMaintainScheduleResponse (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Dtos\RoomMaintainScheduleResponse.cs:6`)

| Property             | Type        | Description                           |
| -------------------- | ----------- | ------------------------------------- |
| `Id`                 | `guid`      | Unique identifier                     |
| `LabRoomId`          | `guid`      | Lab room id                           |
| `IsManyDay`          | `bool`      | Multi-day flag                        |
| `IsAllDay`           | `bool?`     | All day flag                          |
| `StartTime`          | `datetime?` | Start time                            |
| `EndTime`            | `datetime?` | End time                              |
| `NumberOfSlot`       | `int?`      | Number of slots                       |
| `RoomMaintainStatus` | `string?`   | Status as string (`Done` or `NotYet`) |
| `Description`        | `string?`   | Notes                                 |

#### PagedResult<T> (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)

| Property          | Type  | Description                                           |
| ----------------- | ----- | ----------------------------------------------------- |
| `Items`           | `T[]` | Page items                                            |
| `TotalPages`      | `int` | Total pages based on `TotalItemsCount` and `PageSize` |
| `TotalItemsCount` | `int` | Total number of items                                 |
| `ItemsFrom`       | `int` | First item index in this page (1-based)               |
| `ItemsTo`         | `int` | Last item index in this page (1-based)                |

### Notes

- `RoomMaintainStatus` enum: `Done`, `NotYet` (`LabBooking\src\LabBooking.Domain\Entities\RoomMaintainSchedule.cs:25-29`).
- On create, status defaults to `NotYet` (`…CreateRoomMaintainScheduleCommandHandler.cs:20`).
- Response DTO maps enum to string for API output (`LabBooking\src\LabBooking.Application\Features\RoomMaintainSchedules\Dtos\RoomMaintainScheduleProfile.cs:16-17`).
