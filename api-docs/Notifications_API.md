# NotificationsController API

## NotificationsController

- Controller: `NotificationsController`
- Purpose: Manage notifications (send test to self, list by current user, mark as read)
- Base Route: `api/Notifications` (`LabBooking\src\LabBooking.API\Controllers\NotificationsController.cs:8`)

### Endpoints

#### Send Test Notification To Self

- Method: `GET`
- Path: `api/Notifications/send-to-me`
- Summary: Sends a test push notification to the current user’s registered devices and returns a status message (`LabBooking\src\LabBooking.API\Controllers\NotificationsController.cs:12`).
- Authorization: Required (returns `401` if unauthenticated)
- Input: None
- Output
  - Model: `string`
  - Example JSON
    ```json
    "Sent test message to 2 devices."
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`, `404 NotFound`
- Notes
  - Requires the user to have registered device tokens; otherwise `404 NotFound` is returned (`LabBooking\src\LabBooking.Application\Features\Notifications\Commands\SendNotificationToSelf\SendNotificationToSelfCommandHandler.cs:22`).

#### Get All Notifications (Current User)

- Method: `GET`
- Path: `api/Notifications`
- Summary: Retrieves notifications for the authenticated user with optional filtering, sorting, and pagination (`LabBooking\src\LabBooking.API\Controllers\NotificationsController.cs:24`).
- Authorization: Required
- Input
  - Query Parameters (`GetAllNotificationsQuery`) (`LabBooking\src\LabBooking.Application\Features\Notifications\Queries\GetAllNotifications\GetAllNotificationsQuery.cs:8`)
    - `SearchPhrase` (string, optional)
    - `IsRead` (boolean, optional)
    - `PageNumber` (int)
    - `PageSize` (int)
    - `SortBy` (string, optional; allowed: `CreatedAt`, `Title`) (`LabBooking\src\LabBooking.Infrastructure\Repositories\NotificationRepository.cs:36`)
    - `SortDirection` (string; `Ascending` or `Descending`)
- Output
  - Model: `PagedResult<NotificationsResponse>`
  - Properties
    - `Items` (array of `NotificationsResponse`)
    - `TotalPages` (int)
    - `TotalItemsCount` (int)
    - `ItemsFrom` (int)
    - `ItemsTo` (int)
  - Example JSON
    ```json
    {
      "items": [
        {
          "id": "81f0a7d3-6c2c-4c61-9b86-7c2b1f3ea7b2",
          "title": "Booking Approved",
          "message": "Your booking has been approved.",
          "dataPayload": "{\"bookingId\":123}",
          "isRead": false,
          "createdAt": "2025-11-23T09:30:00Z"
        }
      ],
      "totalPages": 5,
      "totalItemsCount": 50,
      "itemsFrom": 1,
      "itemsTo": 10
    }
    ```
- Response Status Codes
  - `200 OK`, `401 Unauthorized`

#### Mark Notification As Read

- Method: `PUT`
- Path: `api/Notifications/{id}/read`
- Summary: Marks a specific notification as read for the current user (`LabBooking\src\LabBooking.API\Controllers\NotificationsController.cs:34`).
- Authorization: Required
- Input
  - Route Parameters
    - `id` (guid): Notification identifier
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `401 Unauthorized`, `403 Forbidden`, `404 NotFound`
- Notes
  - The server verifies ownership; attempting to mark another user’s notification as read returns `401/403` (`LabBooking\src\LabBooking.Application\Features\Notifications\Commands\MarkNotificationAsRead\MarkNotificationAsReadCommandHandler.cs:24-32`).

### Response Models

#### NotificationsResponse (`LabBooking\src\LabBooking.Application\Features\Notifications\Dtos\NotificationsResponse.cs:6`)

| Property      | Type       | Description                           |
| ------------- | ---------- | ------------------------------------- |
| `Id`          | `guid`     | Unique identifier                     |
| `Title`       | `string`   | Notification title                    |
| `Message`     | `string`   | Notification body                     |
| `DataPayload` | `string?`  | JSON payload string (nullable)        |
| `IsRead`      | `bool`     | Read status                           |
| `CreatedAt`   | `datetime` | Creation time (UTC)                   |

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
  - All notification endpoints expect an authenticated user; pass `Authorization: Bearer <accessToken>`.
- Filtering & Sorting
  - Use `IsRead`, `SearchPhrase` to filter; `SortBy` supports `CreatedAt` and `Title`.
- Ownership
  - `PUT /{id}/read` requires the notification to belong to the current user; otherwise the server rejects the request.
- DataPayload
  - `DataPayload` is a JSON string; parse on client to access embedded data (e.g., `bookingId`).

