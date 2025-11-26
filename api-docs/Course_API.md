# CourseController API

## CourseController

- Controller: `CourseController`
- Purpose: Manage courses (create, update, delete, list, get by id)
- Base Route: `api/Course` (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:10`)

### Endpoints

#### Create Course

- Method: `POST`
- Path: `api/Course`
- Summary: Create a new course (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:23`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:19`)
- Input
  - Body Model: `CreateCourseCommand` (`LabBooking\src\LabBooking.Application\Features\Courses\Commands\CreateCourse\CreateCourseCommand.cs:3`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "CourseCode": { "type": "string", "maxLength": 20 },
        "CourseName": { "type": "string", "maxLength": 200 },
        "Description": { "type": "string", "maxLength": 1000 }
      },
      "required": ["CourseCode", "CourseName"]
    }
    ```
- Output
  - Status: `201 Created`
  - Body: `{ "Id": "<new-course-id>" }` (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:28-29`)
- Response Status Codes
  - `201 Created`, `400 BadRequest`, `401 Unauthorized`
- Notes
  - Unique `CourseCode` enforced (`LabBooking\src\LabBooking.Application\Features\Courses\Commands\CreateCourse\CreateCourseCommandValidator.cs:10-16, 29-33`).
  - Length constraints on name/description (`…CreateCourseCommandValidator.cs:18-28`).

#### Update Course

- Method: `PUT`
- Path: `api/Course/{id}`
- Summary: Update course information (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:41`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:37`)
- Input
  - Route Param: `id` (guid)
  - Body Model: `UpdateCourseCommand` (`LabBooking\src\LabBooking.Application\Features\Courses\Commands\UpdateCourse\UpdateCourseCommand.cs:5`)
  - JSON Schema
    ```json
    {
      "type": "object",
      "properties": {
        "CourseCode": { "type": "string", "maxLength": 20 },
        "CourseName": { "type": "string", "maxLength": 200 },
        "Description": { "type": "string", "maxLength": 1000 },
        "IsActive": { "type": "boolean" }
      },
      "required": ["CourseCode", "CourseName"]
    }
    ```
  - Notes: `Id` is taken from the route; body `Id` is ignored on JSON (`JsonIgnore`) (`…UpdateCourseCommand.cs:8`).
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `400 BadRequest` (ID mismatch), `404 NotFound`
- Notes
  - Unique `CourseCode` must remain unique among other records (`LabBooking\src\LabBooking.Application\Features\Courses\Commands\UpdateCourse\UpdateCourseCommandValidator.cs:21-28, 35-40`).

#### Delete Course

- Method: `DELETE`
- Path: `api/Course/{id}`
- Summary: Delete a course (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:62-67`).
- Authorization: Required (`[Authorize(Roles = "Admin")]`) (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:59`)
- Input
  - Route Param: `id` (guid)
- Output
  - Status: `204 NoContent`
- Response Status Codes
  - `204 NoContent`, `404 NotFound`
- Notes
  - Returns `404` if course not found (`…DeleteCourseCommandHandler.cs:11-17`).

#### Get All Courses

- Method: `GET`
- Path: `api/Course`
- Summary: Get a paged list of courses with optional search/sort (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:82`).
- Authorization: None (commented role example in code)
- Input (Query Params) — `GetAllCoursesQuery` (`LabBooking\src\LabBooking.Application\Features\Courses\Queries\GetAllCourses\GetAllCourseQuery.cs:8`)
  - `SearchPhrase` (string, optional)
  - `PageNumber` (int, >= 1) (`…GetAllCourseQueryValidator.cs:18-20`)
  - `PageSize` (int, one of `5,10,15,30`) (`…GetAllCourseQueryValidator.cs:22-25`)
  - `SortBy` (string, optional: `CourseName` or `CourseCode`) (`…GetAllCourseQueryValidator.cs:27-32`)
  - `SortDirection` (`Ascending` or `Descending`)
- Output
  - Model: `PagedResult<CourseResponse>` (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)
  - Example JSON
    ```json
    {
      "items": [
        {
          "id": "e1f2a3b4-c5d6-7890-1234-56789abcdef0",
          "courseCode": "CS101",
          "courseName": "Introduction to CS",
          "description": "Basics of computing",
          "createdDate": "2025-01-01T00:00:00Z",
          "isActive": true
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

#### Get Course By Id

- Method: `GET`
- Path: `api/Course/{id}`
- Summary: Get course details by id (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:97`).
- Authorization: Required (`[Authorize(Roles = "Admin, Manager, User")]`) (`LabBooking\src\LabBooking.API\Controllers\CourseController.cs:94`)
- Input
  - Route Param: `id` (guid)
- Output
  - Model: `CourseResponse` (`LabBooking\src\LabBooking.Application\Features\Courses\Dtos\CourseResponse.cs:8`)
  - Properties
    - `Id` (guid)
    - `CourseCode` (string?)
    - `CourseName` (string?)
    - `Description` (string?)
    - `CreatedDate` (datetime?)
    - `IsActive` (boolean?)
- Response Status Codes
  - `200 OK`, `404 NotFound`

### Response Models

#### CourseResponse (`LabBooking\src\LabBooking.Application\Features\Courses\Dtos\CourseResponse.cs:8`)

| Property       | Type        | Description                    |
| -------------- | ----------- | ------------------------------ |
| `Id`           | `guid`      | Unique identifier              |
| `CourseCode`   | `string?`   | Course code                    |
| `CourseName`   | `string?`   | Course name                    |
| `Description`  | `string?`   | Description (nullable)         |
| `CreatedDate`  | `datetime?` | Creation time (UTC, nullable)  |
| `IsActive`     | `bool?`     | Active status (nullable)       |

#### PagedResult<T> (`LabBooking\src\LabBooking.Application\Common\PagedResult.cs:3`)

| Property          | Type  | Description                                           |
| ----------------- | ----- | ----------------------------------------------------- |
| `Items`           | `T[]` | Page items                                            |
| `TotalPages`      | `int` | Total pages based on `TotalItemsCount` and `PageSize` |
| `TotalItemsCount` | `int` | Total number of items                                 |
| `ItemsFrom`       | `int` | First item index in this page (1-based)               |
| `ItemsTo`         | `int` | Last item index in this page (1-based)                |

