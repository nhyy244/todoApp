from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class TodoGroup(Base):
    __tablename__ = "todo_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    color = Column(String(50), nullable=True)

    # Relationship to todos
    todos = relationship("Todo", back_populates="group", cascade="all, delete-orphan")


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    note = Column(Text, nullable=True)
    group_id = Column(Integer, ForeignKey("todo_groups.id"), nullable=True)

    # Relationship to group
    group = relationship("TodoGroup", back_populates="todos")
