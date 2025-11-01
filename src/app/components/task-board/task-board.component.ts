import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskFormComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent {
  taskService = inject(TaskService);

  isModalVisible = false;
  taskToEdit: Task | null = null;

  getTodoTasks(): Task[] {
    return this.taskService.getTasksByStatus('todo');
  }

  getDoingTasks(): Task[] {
    return this.taskService.getTasksByStatus('doing');
  }

  getDoneTasks(): Task[] {
    return this.taskService.getTasksByStatus('done');
  }

  openNewTaskModal(): void {
    this.taskToEdit = null;
    this.isModalVisible = true;
  }

  openEditTaskModal(task: Task): void {
    this.taskToEdit = task;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.taskToEdit = null;
  }

  handleFormSubmit(formData: Omit<Task, 'id' | 'status'>): void {
    if (this.taskToEdit) {
      this.taskService.updateTask(this.taskToEdit.id, formData);
    } else {
      this.taskService.addTask({ ...formData, status: 'todo' });
    }
    this.closeModal();
  }

  handleDeleteTask(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(id);
    }
  }

  handleMoveTask(event: { id: string, status: 'todo' | 'doing' | 'done' }): void {
    this.taskService.moveTask(event.id, event.status);
  }

  getProximityColor(due: string): string {
    return this.taskService.getProximityColor(due);
  }
}
