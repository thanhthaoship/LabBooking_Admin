# AuthController API

## AuthController

- Controller: `AuthController`
- Purpose: Authentication operations (Google Sign-In, email/password login, logout, register, refresh token, profile)
- Base Route: `api/Auth` (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:5`)

### Endpoints

#### Google Login

- Method: `POST`
- Path: `api/Auth/google`
- Summary: Logs in using a Google account and returns new access and refresh tokens (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:14`).
- Authorization: None
- Input
  - Body Model: `GoogleLoginCommand`
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "IdToken": { "type": "string", "description": "Google ID token" }
      },
      "required": ["IdToken"]
    }
    ```
- Output
  - Model: `AuthResponse` (`LabBooking\src\LabBooking.Application\Features\Authentication\Dtos\AuthResponse.cs:9`)
  - Properties
    - `AccessToken` (string)
    - `RefreshToken` (string)
    - `RefreshTokenExpiry` (datetime)
  - Example JSON
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "c0d3cafe-refresh-token-string",
      "refreshTokenExpiry": "2025-12-31T23:59:59Z"
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `403 Forbidden`, `500 InternalServerError`
- Notes
  - Only `@fpt.edu.vn` emails allowed; others are forbidden (`LabBooking\src\LabBooking.Application\Features\Authentication\Commands\GoogleLogin\GoogleLoginCommandHandler.cs:29-33`).
  - Campus check requires `FamilyName` to contain `HCM`; otherwise forbidden (`LabBooking\src\LabBooking.Application\Features\Authentication\Commands\GoogleLogin\GoogleLoginCommandHandler.cs:35-38`).

#### Email/Password Login

- Method: `POST`
- Path: `api/Auth/login`
- Summary: Logs in using email and password and returns new tokens (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:28`).
- Authorization: None
- Input
  - Body Model: `LoginUserCommand`
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "Email": { "type": "string", "format": "email" },
        "Password": { "type": "string" }
      },
      "required": ["Email", "Password"]
    }
    ```
- Output
  - Model: `AuthResponse` (`LabBooking\src\LabBooking.Application\Features\Authentication\Dtos\AuthResponse.cs:9`)
  - Properties
    - `AccessToken` (string)
    - `RefreshToken` (string)
    - `RefreshTokenExpiry` (datetime)
  - Example JSON
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "c0d3cafe-refresh-token-string",
      "refreshTokenExpiry": "2025-12-31T23:59:59Z"
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `500 InternalServerError`

#### Logout

- Method: `POST`
- Path: `api/Auth/logout`
- Summary: Logs out the current user, invalidating existing tokens by updating the security stamp (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:43`).
- Authorization: Required (`[Authorize]`) (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:44`)
- Input
  - Body: none
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `401 Unauthorized`, `500 InternalServerError`
- Notes
  - Security stamp update forces all existing access tokens to become invalid (`LabBooking\src\LabBooking.Application\Features\Authentication\Commands\Logout\LogoutUserCommandHandler.cs:29-39`).

#### Register

- Method: `POST`
- Path: `api/Auth/register`
- Summary: Registers a new user account and assigns the `User` role (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:61`).
- Authorization: None
- Input
  - Body Model: `RegisterUserCommand`
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
- Body: `{ "message": "Registration successful." }` (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:67`)
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `500 InternalServerError`

#### Refresh Token

- Method: `POST`
- Path: `api/Auth/refresh-token`
- Summary: Exchanges a valid refresh token for a new access token and a rotated refresh token (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:75`).
- Authorization: None
- Input
  - Body Model: `RefreshTokenRequest` (DTO referenced by controller)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "RefreshToken": { "type": "string" }
      },
      "required": ["RefreshToken"]
    }
    ```
- Output
  - Model: `AuthResponse` (`LabBooking\src\LabBooking.Application\Features\Authentication\Dtos\AuthResponse.cs:9`)
  - Properties
    - `AccessToken` (string)
    - `RefreshToken` (string)
    - `RefreshTokenExpiry` (datetime)
  - Example JSON
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "new-rotated-refresh-token",
      "refreshTokenExpiry": "2026-01-31T12:00:00Z"
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `500 InternalServerError`
- Notes
  - Implements token rotation and replay attack detection; presenting a revoked token may revoke all active tokens for the user (`LabBooking\src\LabBooking.Application\Features\Authentication\Commands\RefreshTokens\RefreshTokenCommandHandler.cs:30-43, 60-72`).

#### Get Profile

- Method: `GET`
- Path: `api/Auth/profile`
- Summary: Returns the profile information of the currently authenticated user (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:91`).
- Authorization: Required (`[Authorize]`) (`LabBooking\src\LabBooking.API\Controllers\AuthController.cs:92`)
- Input
  - Body: none
- Output
  - Model: `UserProfileResponse` (`LabBooking\src\LabBooking.Application\Features\Authentication\Dtos\UserProfileResponse.cs:6`)
  - Properties
    - `Id` (guid)
    - `Email` (string, nullable)
    - `UserName` (string, nullable)
    - `Roles` (array of string)
  - Example JSON
    ```json
    {
      "id": "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
      "email": "user@fpt.edu.vn",
      "userName": "user@fpt.edu.vn",
      "roles": ["User"]
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `404 NotFound`, `500 InternalServerError`

### Response Models

#### AuthResponse (`LabBooking\src\LabBooking.Application\Features\Authentication\Dtos\AuthResponse.cs:9`)

| Property             | Type       | Description                     |
| -------------------- | ---------- | ------------------------------- |
| `AccessToken`        | `string`   | JWT access token                |
| `RefreshToken`       | `string`   | Refresh token                   |
| `RefreshTokenExpiry` | `datetime` | Expiration time (UTC, ISO 8601) |

#### UserProfileResponse (`LabBooking\src\LabBooking.Application\Features\Authentication\Dtos\UserProfileResponse.cs:6`)

| Property   | Type       | Description              |
| ---------- | ---------- | ------------------------ |
| `Id`       | `guid`     | User identifier          |
| `Email`    | `string?`  | Email address (nullable) |
| `UserName` | `string?`  | Username (nullable)      |
| `Roles`    | `string[]` | Assigned role names      |

---

## Frontend Notes

- Authorization
  - Endpoints requiring auth: `/logout`, `/profile`.
  - Provide `Authorization: Bearer <accessToken>` for protected endpoints.
- Google Login constraints
  - Email must end with `@fpt.edu.vn` and campus must include `HCM`.
  - Non-compliant accounts will return `403 Forbidden`.
- Token rotation & security
  - Always replace stored refresh tokens after `/refresh-token`.
  - Replay attack detection may revoke all active sessions if a revoked token is presented.
- Error handling
  - Expect `401` for invalid credentials/tokens; `404` when profile not found; general server errors may return `500`.
- Registration
  - Default role `User` is assigned on successful registration; response includes `{ "message": "Registration successful." }`.
