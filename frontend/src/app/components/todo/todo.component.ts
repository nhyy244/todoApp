import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  @Input() todo!: Todo;
  @Output() todoChanged = new EventEmitter<Todo>();
  @Output() todoDeleted = new EventEmitter<number>();

  isEditing = false;
  isHovered = false;
  isEditingNote = false;

  toggleCompleted(): void {
    this.todo.completed = !this.todo.completed;
    this.todoChanged.emit(this.todo);
  }

  toggleNoteEditor(event: Event): void {
    event.stopPropagation();
    this.isEditingNote = !this.isEditingNote;
  }

  saveNote(): void {
    this.isEditingNote = false;
    this.todoChanged.emit(this.todo);
  }

  startEditing(): void {
    if (!this.todo.completed) {
      this.isEditing = true;
    }
  }

  finishEditing(): void {
    this.isEditing = false;
    if (this.todo.title.trim()) {
      this.todoChanged.emit(this.todo);
    }
  }

  deleteTodo(): void {
    this.todoDeleted.emit(this.todo.id);
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}
