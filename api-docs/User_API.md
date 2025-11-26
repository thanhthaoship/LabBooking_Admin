# UsersController API

## UsersController

- Controller: `UsersController`
- Purpose: Manage users listing and role assignments
- Base Route: `api/Users` (`LabBooking\src\LabBooking.API\Controllers\UsersController.cs:7`)
- Authorization: Controller-level `[Authorize]`; endpoints restricted to `Admin`

### Endpoints

#### Get All Users

- Method: `GET`
- Path: `api/Users`
- Summary: Get all users with filtering, sorting, pagination, and role filter (`LabBooking\src\LabBooking.API\Controllers\UsersController.cs:16`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\UsersController.cs:17`)
- Input (Query Params) — `GetAllUsersQuery` (`LabBooking\src\LabBooking.Application\Features\Users\Queries\GetAllUsers\GetAllUsersQuery.cs:12`)
  - `SearchPhrase` (string, optional)
  - `RoleName` (string, optional)
  - `PageNumber` (int, >= 1) (`…GetAllUsersQueryValidator.cs:22-24`)
  - `PageSize` (int, one of `5,10,15,30,50`) (`…GetAllUsersQueryValidator.cs:27-29`)
  - `SortBy` (string, optional: `UserName`, `Email`, `Major`, `RegistrationDate`) (`…GetAllUsersQueryValidator.cs:10-17, 31-36`)
  - `SortDirection` (`Ascending` or `Descending`)
- Output
  - Model: `PagedResult<UserResponse>`
  - Response Status Codes: `200 OK`, `401 Unauthorized`, `403 Forbidden`

#### Assign Role To User

- Method: `POST`
- Path: `api/Users/{userId}/roles`
- Summary: Assign a role to a user (`LabBooking\src\LabBooking.API\Controllers\UsersController.cs:35`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\UsersController.cs:36`)
- Input
  - Route Param: `userId` (guid)
  - Body Model: `AssignRoleToUserCommand` (`LabBooking\src\LabBooking.Application\Features\Users\Commands\AssignRole\AssignRoleToUserCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "RoleName": { "type": "string" }
      },
      "required": ["RoleName"]
    }
    ```
- Validation
  - `UserId` set from route; ignored in JSON (`JsonIgnore`) (`…AssignRoleToUserCommand.cs:7-8`).
  - `RoleName` must not be empty and must exist (`LabBooking\src\LabBooking.Application\Features\Users\Commands\AssignRole\AssignRoleToUserCommandValidator.cs:15-18, 22-28`).
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest`, `404 NotFound`
- Notes
  - Returns `404` if user not found; no-op if user already has the role (`…AssignRoleToUserCommandHandler.cs:10-22`).

### Response Models

#### UserResponse (`LabBooking\src\LabBooking.Application\Features\Users\Dtos\UserResponse.cs:5`)

| Property           | Type       | Description       |
| ------------------ | ---------- | ----------------- |
| `Id`               | `guid`     | Unique identifier |
| `UserName`         | `string?`  | Username          |
| `Email`            | `string?`  | Email             |
| `PhoneNumber`      | `string?`  | Phone             |
| `Major`            | `string?`  | Major/department  |
| `RegistrationDate` | `datetime` | Registration date |

#### PagedResult<T> (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)

| Property          | Type  | Description                                           |
| ----------------- | ----- | ----------------------------------------------------- |
| `Items`           | `T[]` | Page items                                            |
| `TotalPages`      | `int` | Total pages based on `TotalItemsCount` and `PageSize` |
| `TotalItemsCount` | `int` | Total number of items                                 |
| `ItemsFrom`       | `int` | First item index in this page (1-based)               |
| `ItemsTo`         | `int` | Last item index in this page (1-based)                |
