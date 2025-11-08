import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoComponent } from '../todo/todo.component';
import { TodoGroup } from '../../models/todo-group';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo-group',
  imports: [CommonModule, FormsModule, TodoComponent],
  templateUrl: './todo-group.component.html',
  styleUrl: './todo-group.component.css'
})
export class TodoGroupComponent {
  @Input() todoGroup!: TodoGroup;
  @Output() groupChanged = new EventEmitter<TodoGroup>();
  @Output() groupDeleted = new EventEmitter<number>();
  @Output() resizeStart = new EventEmitter<{group: TodoGroup, direction: string, event: MouseEvent, actualWidth: number, actualHeight: number}>();

  isEditingName = false;
  nextTodoId = 1;
  showColorPicker = false;

  presetColors = [
    '#ffffff', // White
    '#ffcccc', // Light Red
    '#ffcc99', // Light Orange
    '#ffffcc', // Light Yellow
    '#ccffcc', // Light Green
    '#ccffff', // Light Cyan
    '#ccccff', // Light Blue
    '#ffccff', // Light Purple
    '#ffb3ba', // Pink
    '#bae1ff', // Baby Blue
    '#c9e4ca', // Mint
    '#fff4e6'  // Cream
  ];

  ngOnInit(): void {
    if (this.todoGroup.todos.length > 0) {
      const maxId = Math.max(...this.todoGroup.todos.map(t => t.id));
      this.nextTodoId = maxId + 1;
    }
    // Set default color if not set
    if (!this.todoGroup.color) {
      this.todoGroup.color = '#ffffff';
    }
  }

  startEditingName(): void {
    this.isEditingName = true;
  }

  finishEditingName(): void {
    this.isEditingName = false;
    if (this.todoGroup.name.trim()) {
      this.groupChanged.emit(this.todoGroup);
    } else {
      this.todoGroup.name = 'Unnamed Group';
    }
  }

  addTodo(): void {
    const newTodo: Todo = {
      id: this.nextTodoId++,
      title: 'New Todo',
      completed: false
    };
    this.todoGroup.todos.push(newTodo);
    this.groupChanged.emit(this.todoGroup);
  }

  onTodoChanged(updatedTodo: Todo): void {
    const index = this.todoGroup.todos.findIndex(t => t.id === updatedTodo.id);
    if (index !== -1) {
      this.todoGroup.todos[index] = updatedTodo;
      this.groupChanged.emit(this.todoGroup);
    }
  }

  onTodoDeleted(todoId: number): void {
    this.todoGroup.todos = this.todoGroup.todos.filter(t => t.id !== todoId);
    this.groupChanged.emit(this.todoGroup);
  }

  deleteGroup(): void {
    this.groupDeleted.emit(this.todoGroup.id);
  }

  toggleColorPicker(event: Event): void {
    event.stopPropagation();
    this.showColorPicker = !this.showColorPicker;
  }

  changeColor(color: string): void {
    this.todoGroup.color = color;
    this.showColorPicker = false;
    this.groupChanged.emit(this.todoGroup);
  }

  startResize(event: MouseEvent, direction: string): void {
    event.stopPropagation();
    event.preventDefault();

    // Get the actual rendered dimensions
    const target = event.target as HTMLElement;
    const container = target.closest('.todo-group-container') as HTMLElement;
    const actualWidth = container.offsetWidth;
    const actualHeight = container.offsetHeight;

    this.resizeStart.emit({
      group: this.todoGroup,
      direction,
      event,
      actualWidth,
      actualHeight
    });
  }
}
