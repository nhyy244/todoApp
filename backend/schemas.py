from pydantic import BaseModel
from typing import List, Optional


# Todo Schemas
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    note: Optional[str] = None


class TodoCreate(TodoBase):
    group_id: Optional[int] = None


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    note: Optional[str] = None
    group_id: Optional[int] = None


class Todo(TodoBase):
    id: int
    group_id: Optional[int] = None

    class Config:
        from_attributes = True


# TodoGroup Schemas
class TodoGroupBase(BaseModel):
    name: str
    color: Optional[str] = None


class TodoGroupCreate(TodoGroupBase):
    pass


class TodoGroupUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class TodoGroup(TodoGroupBase):
    id: int
    todos: List[Todo] = []

    class Config:
        from_attributes = True
