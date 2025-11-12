from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv

import models
import schemas
from database import engine, get_db

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Todo API is running with PostgreSQL"}


# Todo Endpoints
@app.get("/api/todos", response_model=List[schemas.Todo])
async def get_todos(db: Session = Depends(get_db)):
    todos = db.query(models.Todo).all()
    return todos


@app.post("/api/todos", response_model=schemas.Todo)
async def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    # Verify group exists if group_id is provided
    if todo.group_id:
        group = db.query(models.TodoGroup).filter(models.TodoGroup.id == todo.group_id).first()
        if not group:
            raise HTTPException(status_code=404, detail="TodoGroup not found")

    db_todo = models.Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.get("/api/todos/{todo_id}", response_model=schemas.Todo)
async def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/api/todos/{todo_id}", response_model=schemas.Todo)
async def update_todo(todo_id: int, todo_update: schemas.TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Update only provided fields
    update_data = todo_update.model_dump(exclude_unset=True)

    # Verify group exists if group_id is being updated
    if "group_id" in update_data and update_data["group_id"]:
        group = db.query(models.TodoGroup).filter(models.TodoGroup.id == update_data["group_id"]).first()
        if not group:
            raise HTTPException(status_code=404, detail="TodoGroup not found")

    for key, value in update_data.items():
        setattr(db_todo, key, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/api/todos/{todo_id}")
async def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted"}


# TodoGroup Endpoints
@app.get("/api/groups", response_model=List[schemas.TodoGroup])
async def get_groups(db: Session = Depends(get_db)):
    groups = db.query(models.TodoGroup).all()
    return groups


@app.post("/api/groups", response_model=schemas.TodoGroup)
async def create_group(group: schemas.TodoGroupCreate, db: Session = Depends(get_db)):
    db_group = models.TodoGroup(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


@app.get("/api/groups/{group_id}", response_model=schemas.TodoGroup)
async def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(models.TodoGroup).filter(models.TodoGroup.id == group_id).first()
    if group is None:
        raise HTTPException(status_code=404, detail="TodoGroup not found")
    return group


@app.put("/api/groups/{group_id}", response_model=schemas.TodoGroup)
async def update_group(group_id: int, group_update: schemas.TodoGroupUpdate, db: Session = Depends(get_db)):
    db_group = db.query(models.TodoGroup).filter(models.TodoGroup.id == group_id).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="TodoGroup not found")

    # Update only provided fields
    update_data = group_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_group, key, value)

    db.commit()
    db.refresh(db_group)
    return db_group


@app.delete("/api/groups/{group_id}")
async def delete_group(group_id: int, db: Session = Depends(get_db)):
    db_group = db.query(models.TodoGroup).filter(models.TodoGroup.id == group_id).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="TodoGroup not found")

    db.delete(db_group)
    db.commit()
    return {"message": "TodoGroup deleted"}
