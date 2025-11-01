import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule para usar ngModel
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  // Recebe se o modal deve estar visível
  @Input() isVisible: boolean = false;
  
  // Recebe a tarefa para edição (opcional)
  @Input() taskToEdit: Task | null = null;

  // Emite evento quando o formulário é submetido
  @Output() onSubmit = new EventEmitter<Omit<Task, 'id' | 'status'>>();
  
  // Emite evento quando o modal é fechado
  @Output() onClose = new EventEmitter<void>();

  // Dados do formulário
  title: string = '';
  due: string = '';
  level: 'low' | 'medium' | 'high' = 'low';
  desc: string = '';

  ngOnInit(): void {
    // Se estiver editando, preenche os campos
    if (this.taskToEdit) {
      this.title = this.taskToEdit.title;
      this.due = this.taskToEdit.due;
      this.level = this.taskToEdit.level;
      this.desc = this.taskToEdit.desc;
    }
  }

  // Quando recebe uma nova tarefa para editar
  ngOnChanges(): void {
    if (this.taskToEdit) {
      this.title = this.taskToEdit.title;
      this.due = this.taskToEdit.due;
      this.level = this.taskToEdit.level;
      this.desc = this.taskToEdit.desc;
    } else {
      this.resetForm();
    }
  }

  // Envia o formulário
  submitForm(): void {
    if (!this.title.trim() || !this.due) {
      alert('Por favor, preencha o título e a data!');
      return;
    }

    this.onSubmit.emit({
      title: this.title.trim(),
      due: this.due,
      level: this.level,
      desc: this.desc.trim()
    });

    this.resetForm();
  }

  // Limpa os campos do formulário
  resetForm(): void {
    this.title = '';
    this.due = '';
    this.level = 'low';
    this.desc = '';
  }

  // Fecha o modal
  closeModal(): void {
    this.resetForm();
    this.onClose.emit();
  }

  // Fecha o modal ao clicar no backdrop
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).hasAttribute('data-modal-backdrop')) {
      this.closeModal();
    }
  }
}
