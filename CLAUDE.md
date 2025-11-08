# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack todo application with a monorepo structure:
- `backend/` - Python FastAPI REST API server
- `frontend/` - Angular 19 web application

## Tech Stack

**Backend:**
- Python 3.10+ with FastAPI
- Uvicorn ASGI server
- Pydantic for data validation
- In-memory storage (database to be added later)

**Frontend:**
- Angular 19.2
- TypeScript
- Angular CLI for development and building

## Common Commands

### Backend Development

```bash
cd backend

# First time setup
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run development server (with auto-reload)
uvicorn main:app --reload --port 8000

# Run tests (when added)
pytest
```

Backend API runs at `http://localhost:8000`
- API docs (Swagger): http://localhost:8000/docs
- API docs (ReDoc): http://localhost:8000/redoc

### Frontend Development

```bash
cd frontend

# First time setup
npm install

# Run development server
ng serve
# Or with custom port
ng serve --port 4200

# Build for production
ng build

# Run tests
ng test

# Run e2e tests (framework needs to be added)
ng e2e

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name
```

Frontend app runs at `http://localhost:4200`

## Architecture

### API Structure

The backend provides a RESTful API with the following endpoints:

- `GET /` - Health check
- `GET /api/todos` - Retrieve all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get specific todo by ID
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

**Data Model:**
```python
{
    "id": int,
    "title": str,
    "description": str | None,
    "completed": bool
}
```

### CORS Configuration

Backend is configured to accept requests from `http://localhost:4200` (Angular dev server).

### Current Data Storage

Backend currently uses in-memory storage (Python list). Data is lost on server restart. Database integration planned for future.

## Project Structure

```
backend/
├── main.py              # FastAPI application with all endpoints
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── .gitignore
└── README.md

frontend/
├── src/
│   ├── app/            # Angular application code
│   │   ├── app.component.*
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── main.ts         # Application entry point
│   ├── index.html
│   └── styles.css
├── public/             # Static assets
├── angular.json        # Angular CLI configuration
├── package.json        # npm dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Development Notes

- Backend runs on port 8000, frontend on port 4200
- Frontend needs to be configured to call backend API endpoints
- Add HTTP client service in Angular to communicate with FastAPI backend
- Database integration should be added when needed (PostgreSQL recommended)
