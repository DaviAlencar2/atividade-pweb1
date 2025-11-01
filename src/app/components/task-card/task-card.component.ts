import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() proximityColor: string = '';

  @Output() onEdit = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onMove = new EventEmitter<{ id: string, status: 'todo' | 'doing' | 'done' }>();

  getLevelLabel(): string {
    switch (this.task.level) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return '';
    }
  }

  editTask(): void {
    this.onEdit.emit(this.task);
  }

  deleteTask(): void {
    this.onDelete.emit(this.task.id);
  }

  moveTask(newStatus: 'todo' | 'doing' | 'done'): void {
    if (newStatus !== this.task.status) {
      this.onMove.emit({ id: this.task.id, status: newStatus });
    }
  }
}
