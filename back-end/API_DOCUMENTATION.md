# Sticky Notes SaaS API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
The API uses Laravel Sanctum for authentication. Include the bearer token in the Authorization header for protected routes.

```
Authorization: Bearer {token}
```

## Default Users
- **Admin**: admin@taskflow.com / admin123
- **User**: user@taskflow.com / user123

## API Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@taskflow.com",
  "password": "admin123"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

#### Get Current User
```http
GET /auth/user
Authorization: Bearer {token}
```

### Sticky Notes

#### Get All Notes
```http
GET /sticky-notes
Authorization: Bearer {token}
```

#### Create Note
```http
POST /sticky-notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "My note content",
  "x": 100,
  "y": 150,
  "width": 200,
  "height": 200,
  "color": "#fef3c7",
  "z_index": 1,
  "font_size": 14,
  "font_family": "Inter, sans-serif",
  "project_id": null
}
```

#### Update Note
```http
PUT /sticky-notes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Updated content",
  "x": 150,
  "y": 200
}
```

#### Delete Note
```http
DELETE /sticky-notes/{id}
Authorization: Bearer {token}
```

### Projects

#### Get All Projects
```http
GET /projects
Authorization: Bearer {token}
```

#### Create Project
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description",
  "status": "active",
  "color": "bg-blue-500",
  "progress": 0,
  "due_date": "2024-12-31"
}
```

#### Get Project Details
```http
GET /projects/{id}
Authorization: Bearer {token}
```

#### Update Project
```http
PUT /projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Project Name",
  "progress": 50
}
```

#### Delete Project
```http
DELETE /projects/{id}
Authorization: Bearer {token}
```

### Tasks

#### Get All Tasks
```http
GET /tasks
Authorization: Bearer {token}
```

#### Get Tasks for Project
```http
GET /tasks?project_id={project_id}
Authorization: Bearer {token}
```

#### Create Task
```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "project_id": 1,
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "due_date": "2024-12-31"
}
```

#### Update Task
```http
PUT /tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Task",
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /tasks/{id}
Authorization: Bearer {token}
```

### Admin Routes (Admin Only)

#### Get All Users
```http
GET /admin/users
Authorization: Bearer {admin_token}
```

#### Get User Details
```http
GET /admin/users/{id}
Authorization: Bearer {admin_token}
```

#### Update User Role
```http
PUT /admin/users/{id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User
```http
DELETE /admin/users/{id}
Authorization: Bearer {admin_token}
```

## Response Format

### Success Response
```json
{
  "user": { ... },
  "token": "...",
  "projects": [ ... ],
  "notes": [ ... ],
  "tasks": [ ... ]
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error