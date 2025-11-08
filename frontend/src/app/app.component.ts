import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './components/canvas/canvas.component';
import { TodoGroup } from './models/todo-group';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  todoGroups: TodoGroup[] = [
    {
      id: 1,
      name: 'Work Tasks',
      x: 100,
      y: 100,
      todos: [
        { id: 1, title: 'Finish project proposal', completed: false },
        { id: 2, title: 'Review pull requests', completed: false },
        { id: 3, title: 'Team meeting at 3pm', completed: false }
      ]
    },
    {
      id: 2,
      name: 'Personal',
      color: '#ffcc99',
      x: 900,
      y: 100,
      todos: [
        { id: 1, title: 'Buy groceries', completed: false },
        { id: 2, title: 'Call dentist', completed: true },
        { id: 3, title: 'Workout', completed: false }
      ]
    }
  ];

  nextGroupId = 3;

  addGroup(): void {
    const newGroup: TodoGroup = {
      id: this.nextGroupId++,
      name: 'New Group',
      x: 100 + (this.nextGroupId * 50),
      y: 100 + (this.nextGroupId * 50),
      todos: []
    };
    this.todoGroups.push(newGroup);
  }

  onGroupsChanged(updatedGroups: TodoGroup[]): void {
    this.todoGroups = updatedGroups;
  }
}
