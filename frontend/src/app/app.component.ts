import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './components/canvas/canvas.component';
import { TodoGroup } from './models/todo-group';
import { TodoGroupService } from './services/todo-group.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  todoGroups: TodoGroup[] = [];

  // Store UI-specific properties separately (not persisted to backend)
  groupUiState: Map<number, { x: number; y: number; width?: number; height?: number }> = new Map();

  constructor(private todoGroupService: TodoGroupService) {}

  ngOnInit(): void {
    this.loadUiState();
    this.loadGroups();
  }

  loadGroups(): void {
    this.todoGroupService.getGroups().subscribe({
      next: (groups) => {
        this.todoGroups = groups.map((group, index) => {
          // Get saved UI state or use default positions
          const uiState = this.groupUiState.get(group.id) || {
            x: 100 + (index * 50),
            y: 100 + (index * 50)
          };
          return { ...group, ...uiState };
        });
      },
      error: (error) => {
        console.error('Error loading groups:', error);
      }
    });
  }

  addGroup(): void {
    const newGroup = {
      name: 'New Group',
      color: '#ffffff'
    };

    this.todoGroupService.createGroup(newGroup).subscribe({
      next: (createdGroup) => {
        // Add with UI properties
        const groupWithUi = {
          ...createdGroup,
          x: 100 + (this.todoGroups.length * 50),
          y: 100 + (this.todoGroups.length * 50),
          todos: []
        };
        this.todoGroups.push(groupWithUi);

        // Save UI state
        this.groupUiState.set(createdGroup.id, {
          x: groupWithUi.x,
          y: groupWithUi.y,
          width: groupWithUi.width,
          height: groupWithUi.height
        });
        this.saveUiState();
      },
      error: (error) => {
        console.error('Error creating group:', error);
      }
    });
  }

  onGroupsChanged(updatedGroups: TodoGroup[]): void {
    this.todoGroups = updatedGroups;

    // Update UI state for all groups
    updatedGroups.forEach(group => {
      this.groupUiState.set(group.id, {
        x: group.x,
        y: group.y,
        width: group.width,
        height: group.height
      });
    });
    this.saveUiState();
  }

  private saveUiState(): void {
    // Save UI state to localStorage
    const state: any = {};
    this.groupUiState.forEach((value, key) => {
      state[key] = value;
    });
    localStorage.setItem('todoGroupUiState', JSON.stringify(state));
  }

  private loadUiState(): void {
    // Load UI state from localStorage
    const saved = localStorage.getItem('todoGroupUiState');
    if (saved) {
      const state = JSON.parse(saved);
      Object.keys(state).forEach(key => {
        this.groupUiState.set(parseInt(key), state[key]);
      });
    }
  }
}
