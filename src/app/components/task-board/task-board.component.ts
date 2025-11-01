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
  // Injeção de dependência do serviço
  // inject() é a forma moderna de injetar dependências no Angular
  taskService = inject(TaskService);

  // Controla se o modal está visível
  isModalVisible = false;

  // Armazena a tarefa sendo editada (null se estiver criando uma nova)
  taskToEdit: Task | null = null;

  // Retorna todas as tarefas do status "todo"
  getTodoTasks(): Task[] {
    return this.taskService.getTasksByStatus('todo');
  }

  // Retorna todas as tarefas do status "doing"
  getDoingTasks(): Task[] {
    return this.taskService.getTasksByStatus('doing');
  }

  // Retorna todas as tarefas do status "done"
  getDoneTasks(): Task[] {
    return this.taskService.getTasksByStatus('done');
  }

  // Abre o modal para criar uma nova tarefa
  openNewTaskModal(): void {
    this.taskToEdit = null;
    this.isModalVisible = true;
  }

  // Abre o modal para editar uma tarefa existente
  openEditTaskModal(task: Task): void {
    this.taskToEdit = task;
    this.isModalVisible = true;
  }

  // Fecha o modal
  closeModal(): void {
    this.isModalVisible = false;
    this.taskToEdit = null;
  }

  // Chamado quando o formulário é submetido
  handleFormSubmit(formData: Omit<Task, 'id' | 'status'>): void {
    if (this.taskToEdit) {
      // Se estiver editando, atualiza a tarefa
      this.taskService.updateTask(this.taskToEdit.id, formData);
    } else {
      // Se não, cria uma nova tarefa com status 'todo'
      this.taskService.addTask({ ...formData, status: 'todo' });
    }
    this.closeModal();
  }

  // Exclui uma tarefa
  handleDeleteTask(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(id);
    }
  }

  // Move uma tarefa para outra coluna
  handleMoveTask(event: { id: string, status: 'todo' | 'doing' | 'done' }): void {
    this.taskService.moveTask(event.id, event.status);
  }

  // Retorna a cor do indicador de proximidade
  getProximityColor(due: string): string {
    return this.taskService.getProximityColor(due);
  }
}
