# SecurityGuardController API

## SecurityGuardController

- Controller: `SecurityGuardController`
- Purpose: Manage security guards (create, retrieve, update, delete)
- Base Route: `api/SecurityGuard` (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:9`)

### Endpoints

#### Create Security Guard

- Method: `POST`
- Path: `api/SecurityGuard`
- Summary: Register a new security guard account (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:21`).
- Authorization: None
- Input
  - Body Model: `CreateSecurityGuardCommand` (`LabBooking\src\LabBooking.Application\Features\SecurityGuards\Commands\CreateSecurityGuard\CreateSecurityGuardCommand.cs:6`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "Email": { "type": "string", "format": "email" },
        "Password": { "type": "string" },
        "ConfirmPassword": { "type": "string" }
      },
      "required": ["Email", "Password", "ConfirmPassword"]
    }
    ```
- Output
  - Status: `201 Created`
  - Body: `{ "message": "Security Guard created successfully." }`
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `401 Unauthorized`, `403 Forbidden`
- Notes
  - Ensures role `SecurityGuard` exists before creating user, otherwise fails (`LabBooking\src\LabBooking.Application\Features\SecurityGuards\Commands\CreateSecurityGuard\CreateSecurityGuardCommandHandler.cs:13-21`).
  - Maps command to `User`, creates user, assigns role; rolls back if role assignment fails (`…CreateSecurityGuardCommandHandler.cs:22-54`).
  - Validation rules: email required/unique, password length, confirm password must match (`…CreateSecurityGuardCommandValidator.cs:12-28`).

#### Get By Id

- Method: `GET`
- Path: `api/SecurityGuard/{id}`
- Summary: Get security guard details by id (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:35`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:36`)
- Input
  - Route Param: `id` (guid)
- Output
  - Model: `SecurityGuardResponse` (`LabBooking\src\LabBooking.Application\Features\SecurityGuards\Dtos\SecurityGuardResponse.cs:3`)
  - Properties
    - `Id` (guid)
    - `Email` (string)
    - `UserName` (string)
    - `PhoneNumber` (string, nullable)
  - Example JSON
    ```json
    {
      "id": "5f1d4b0e-8b1a-4d2f-9d3c-2a1b0c9d8e7f",
      "email": "guard1@fpt.edu.vn",
      "userName": "guard1@fpt.edu.vn",
      "phoneNumber": "0123456789"
    }
    ```
- Response Status Codes
  - `200 OK`, `404 NotFound`
- Notes
  - Returns `404` if user not found or not in role `SecurityGuard` (`LabBooking\src\LabBooking.Application\Features\SecurityGuards\Queries\GetByIdSecurityGuard\GetSecurityGuardByIdQueryHandler.cs:17-28`).

#### Update

- Method: `PUT`
- Path: `api/SecurityGuard/{id}`
- Summary: Update security guard information (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:48`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:49`)
- Input
  - Route Param: `id` (guid)
  - Body Model: `UpdateSecurityGuardCommand` (`LabBooking\src\LabBooking.Application\Features\SecurityGuards\Commands\UpdateSecurityGuard\UpdateSecurityGuardCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "Email": { "type": "string", "format": "email" },
        "PhoneNumber": {
          "type": "string",
          "pattern": "^\\d{10,11}$",
          "description": "10–11 digits"
        }
      },
      "required": ["Email"]
    }
    ```
  - Notes: `Id` is set from route; body `Id` is ignored during JSON serialization (`JsonIgnore`) (`…UpdateSecurityGuardCommand.cs:7`).
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `404 NotFound`
- Notes
  - Validates email and phone format (`…UpdateSecurityGuardCommandValidator.cs:7-14`).
  - Ensures target is in role `SecurityGuard` before update (`…UpdateSecurityGuardCommandHandler.cs:11-17`).

#### Delete

- Method: `DELETE`
- Path: `api/SecurityGuard/{id}`
- Summary: Delete a security guard (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:67`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\SecurityGuardController.cs:68`)
- Input
  - Route Param: `id` (guid)
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `404 NotFound`
- Notes
  - Deletes only when user is in role `SecurityGuard`; otherwise `404` (`LabBooking\src\LabBooking.Application\Features\SecurityGuards\Commands\DeleteSecurityGuard\DeleteSecurityGuardCommandHandler.cs:9-17`).

### Response Models

#### SecurityGuardResponse (`LabBooking\src\LabBooking.Application\Features\SecurityGuards\Dtos\SecurityGuardResponse.cs:3`)

| Property      | Type      | Description              |
| ------------- | --------- | ------------------------ |
| `Id`          | `guid`    | Unique identifier        |
| `Email`       | `string`  | Email address            |
| `UserName`    | `string`  | Username (usually Email) |
| `PhoneNumber` | `string?` | Phone (nullable)         |
