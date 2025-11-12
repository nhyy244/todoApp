import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo.service';

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
  isDeleteHovered = false;

  constructor(private todoService: TodoService) {}

  toggleCompleted(): void {
    this.todo.completed = !this.todo.completed;

    this.todoService.updateTodo(this.todo.id, {
      completed: this.todo.completed
    }).subscribe({
      next: () => {
        this.todoChanged.emit(this.todo);
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        // Revert the change on error
        this.todo.completed = !this.todo.completed;
      }
    });
  }

  toggleNoteEditor(event: Event): void {
    event.stopPropagation();
    this.isEditingNote = !this.isEditingNote;
  }

  saveNote(): void {
    this.isEditingNote = false;

    this.todoService.updateTodo(this.todo.id, {
      note: this.todo.note
    }).subscribe({
      next: () => {
        this.todoChanged.emit(this.todo);
      },
      error: (error) => {
        console.error('Error updating todo note:', error);
      }
    });
  }

  startEditing(): void {
    if (!this.todo.completed) {
      this.isEditing = true;
    }
  }

  finishEditing(): void {
    this.isEditing = false;
    if (this.todo.title.trim()) {
      this.todoService.updateTodo(this.todo.id, {
        title: this.todo.title
      }).subscribe({
        next: () => {
          this.todoChanged.emit(this.todo);
        },
        error: (error) => {
          console.error('Error updating todo title:', error);
        }
      });
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

  onDeleteMouseEnter(): void {
    this.isDeleteHovered = true;
  }

  onDeleteMouseLeave(): void {
    this.isDeleteHovered = false;
  }
}
