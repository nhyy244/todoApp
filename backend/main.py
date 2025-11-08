from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Todo API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database later)
todos = []
next_id = 1


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class Todo(TodoCreate):
    id: int


@app.get("/")
async def root():
    return {"message": "Todo API is running"}


@app.get("/api/todos", response_model=List[Todo])
async def get_todos():
    return todos


@app.post("/api/todos", response_model=Todo)
async def create_todo(todo: TodoCreate):
    global next_id
    new_todo = Todo(id=next_id, **todo.dict())
    todos.append(new_todo)
    next_id += 1
    return new_todo


@app.get("/api/todos/{todo_id}", response_model=Todo)
async def get_todo(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    return {"error": "Todo not found"}


@app.put("/api/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo_update: TodoCreate):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            updated_todo = Todo(id=todo_id, **todo_update.dict())
            todos[i] = updated_todo
            return updated_todo
    return {"error": "Todo not found"}


@app.delete("/api/todos/{todo_id}")
async def delete_todo(todo_id: int):
    global todos
    todos = [todo for todo in todos if todo.id != todo_id]
    return {"message": "Todo deleted"}
