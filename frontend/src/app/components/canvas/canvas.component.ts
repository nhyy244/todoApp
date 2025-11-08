import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoGroupComponent } from '../todo-group/todo-group.component';
import { TodoGroup } from '../../models/todo-group';

@Component({
  selector: 'app-canvas',
  imports: [CommonModule, TodoGroupComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent {
  @Input() todoGroups: TodoGroup[] = [];
  @Output() groupsChanged = new EventEmitter<TodoGroup[]>();

  // Canvas pan offset
  panX = 0;
  panY = 0;

  // Canvas zoom
  scale = 1.0;
  minScale = 0.1;
  maxScale = 1.0;

  // Canvas panning state
  isPanning = false;
  panStartX = 0;
  panStartY = 0;

  // Dragging TodoGroup state
  draggedGroup: TodoGroup | null = null;
  dragStartX = 0;
  dragStartY = 0;
  dragOffsetX = 0;
  dragOffsetY = 0;

  // Resizing TodoGroup state
  resizingGroup: TodoGroup | null = null;
  resizeDirection: string = '';
  resizeStartWidth = 0;
  resizeStartHeight = 0;
  resizeStartX = 0;
  resizeStartY = 0;

  // Canvas panning
  onCanvasMouseDown(event: MouseEvent): void {
    // Only pan with left mouse button on canvas background
    if (event.button === 0 && event.target === event.currentTarget) {
      this.isPanning = true;
      this.panStartX = event.clientX - this.panX;
      this.panStartY = event.clientY - this.panY;
      event.preventDefault();
    }
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if (this.isPanning) {
      this.panX = event.clientX - this.panStartX;
      this.panY = event.clientY - this.panStartY;
      event.preventDefault();
    } else if (this.draggedGroup) {
      // Update dragged group position (accounting for scale)
      const newX = (event.clientX - this.dragStartX - this.panX) / this.scale;
      const newY = (event.clientY - this.dragStartY - this.panY) / this.scale;

      this.draggedGroup.x = newX;
      this.draggedGroup.y = newY;
      event.preventDefault();
    } else if (this.resizingGroup) {
      // Calculate delta in canvas coordinates
      const deltaX = (event.clientX - this.resizeStartX) / this.scale;
      const deltaY = (event.clientY - this.resizeStartY) / this.scale;

      // Apply resize based on direction
      if (this.resizeDirection === 'right' || this.resizeDirection === 'corner') {
        this.resizingGroup.width = Math.max(300, this.resizeStartWidth + deltaX);
      }
      if (this.resizeDirection === 'bottom' || this.resizeDirection === 'corner') {
        this.resizingGroup.height = Math.max(200, this.resizeStartHeight + deltaY);
      }
      event.preventDefault();
    }
  }

  onCanvasMouseUp(event: MouseEvent): void {
    if (this.isPanning) {
      this.isPanning = false;
    }
    if (this.draggedGroup) {
      this.draggedGroup = null;
      this.groupsChanged.emit(this.todoGroups);
    }
    if (this.resizingGroup) {
      this.resizingGroup = null;
      this.resizeDirection = '';
      this.groupsChanged.emit(this.todoGroups);
    }
  }

  // Canvas zooming
  onCanvasWheel(event: WheelEvent): void {
    event.preventDefault();

    // Get mouse position relative to viewport
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate zoom delta
    const zoomIntensity = 0.1;
    const delta = event.deltaY > 0 ? -zoomIntensity : zoomIntensity;
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));

    if (newScale === this.scale) {
      return; // No change in scale
    }

    // Calculate the point in canvas coordinates before zoom
    const canvasX = (mouseX - this.panX) / this.scale;
    const canvasY = (mouseY - this.panY) / this.scale;

    // Update scale
    this.scale = newScale;

    // Adjust pan to keep the point under the mouse cursor
    this.panX = mouseX - canvasX * this.scale;
    this.panY = mouseY - canvasY * this.scale;
  }

  // TodoGroup dragging
  onGroupMouseDown(event: MouseEvent, group: TodoGroup): void {
    // Check if the click is on the group header (for dragging)
    const target = event.target as HTMLElement;
    const groupHeader = target.closest('.group-header');

    if (groupHeader && event.button === 0) {
      this.draggedGroup = group;
      this.dragStartX = event.clientX - (group.x * this.scale) - this.panX;
      this.dragStartY = event.clientY - (group.y * this.scale) - this.panY;
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onGroupChanged(updatedGroup: TodoGroup): void {
    const index = this.todoGroups.findIndex(g => g.id === updatedGroup.id);
    if (index !== -1) {
      this.todoGroups[index] = updatedGroup;
      this.groupsChanged.emit(this.todoGroups);
    }
  }

  onGroupDeleted(groupId: number): void {
    this.todoGroups = this.todoGroups.filter(g => g.id !== groupId);
    this.groupsChanged.emit(this.todoGroups);
  }

  onResizeStart(data: {group: TodoGroup, direction: string, event: MouseEvent, actualWidth: number, actualHeight: number}): void {
    this.resizingGroup = data.group;
    this.resizeDirection = data.direction;
    this.resizeStartX = data.event.clientX;
    this.resizeStartY = data.event.clientY;
    this.resizeStartWidth = data.actualWidth;
    this.resizeStartHeight = data.actualHeight;
  }

  getGroupStyle(group: TodoGroup): any {
    return {
      position: 'absolute',
      left: group.x + 'px',
      top: group.y + 'px',
      cursor: this.draggedGroup === group ? 'grabbing' : 'default'
    };
  }

  getCanvasStyle(): any {
    return {
      transform: `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`,
      cursor: this.isPanning ? 'grabbing' : 'default'
    };
  }
}
