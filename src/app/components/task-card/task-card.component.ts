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
  // @Input permite receber dados do componente pai
  @Input() task!: Task; // O "!" diz ao TypeScript que essa propriedade será definida
  @Input() proximityColor: string = '';

  // @Output permite enviar eventos para o componente pai
  @Output() onEdit = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onMove = new EventEmitter<{ id: string, status: 'todo' | 'doing' | 'done' }>();

  // Retorna o texto do nível de prioridade
  getLevelLabel(): string {
    switch (this.task.level) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return '';
    }
  }

  // Emite evento de edição
  editTask(): void {
    this.onEdit.emit(this.task);
  }

  // Emite evento de exclusão
  deleteTask(): void {
    this.onDelete.emit(this.task.id);
  }

  // Emite evento de movimentação entre colunas
  moveTask(newStatus: 'todo' | 'doing' | 'done'): void {
    if (newStatus !== this.task.status) {
      this.onMove.emit({ id: this.task.id, status: newStatus });
    }
  }
}
