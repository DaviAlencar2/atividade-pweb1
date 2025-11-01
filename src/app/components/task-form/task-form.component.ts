import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() taskToEdit: Task | null = null;

  @Output() onSubmit = new EventEmitter<Omit<Task, 'id' | 'status'>>();
  @Output() onClose = new EventEmitter<void>();

  title: string = '';
  due: string = '';
  level: 'low' | 'medium' | 'high' = 'low';
  desc: string = '';

  ngOnInit(): void {
    if (this.taskToEdit) {
      this.title = this.taskToEdit.title;
      this.due = this.taskToEdit.due;
      this.level = this.taskToEdit.level;
      this.desc = this.taskToEdit.desc;
    }
  }

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

  resetForm(): void {
    this.title = '';
    this.due = '';
    this.level = 'low';
    this.desc = '';
  }

  closeModal(): void {
    this.resetForm();
    this.onClose.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).hasAttribute('data-modal-backdrop')) {
      this.closeModal();
    }
  }
}
