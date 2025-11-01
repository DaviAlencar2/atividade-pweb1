import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root' // Isso torna o serviço disponível em toda a aplicação
})
export class TaskService {
  // Chave para salvar no localStorage
  private readonly STORAGE_KEY = 'app_task_manager_tasks_v1';

  // Signal que armazena a lista de tarefas
  // Signals são uma forma reativa de gerenciar estado no Angular
  tasks = signal<Task[]>([]);

  constructor() {
    // Quando o serviço é criado, carrega as tarefas do localStorage
    this.loadTasks();
  }

  // Gera um ID único para cada tarefa
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Adiciona dias a uma data e retorna no formato ISO
  private addDaysISO(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  // Carrega as tarefas do localStorage
  private loadTasks(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        // Se não existir dados salvos, cria tarefas iniciais
        this.seedTasks();
      } else {
        // Se existir, converte de JSON para array e atualiza o signal
        this.tasks.set(JSON.parse(raw));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas', error);
      this.tasks.set([]);
    }
  }

  // Salva as tarefas no localStorage
  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks()));
  }

  // Cria tarefas iniciais (seed data)
  private seedTasks(): void {
    const initialTasks: Task[] = [
      {
        id: this.generateId(),
        title: 'Ler capítulo 3 de Algoritmos',
        due: this.addDaysISO(2),
        level: 'high',
        desc: 'Priorizar exercícios 3.1-3.5',
        status: 'todo'
      },
      {
        id: this.generateId(),
        title: 'Resolver lista de TS',
        due: this.addDaysISO(5),
        level: 'medium',
        desc: 'Atenção a generics',
        status: 'doing'
      },
      {
        id: this.generateId(),
        title: 'Revisão rápida: HTML/CSS',
        due: this.addDaysISO(10),
        level: 'low',
        desc: '30 minutos',
        status: 'done'
      }
    ];
    this.tasks.set(initialTasks);
    this.saveTasks();
  }

  // Adiciona uma nova tarefa
  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: this.generateId()
    };
    // update() permite atualizar o signal baseado no valor anterior
    this.tasks.update(currentTasks => [...currentTasks, newTask]);
    this.saveTasks();
  }

  // Atualiza uma tarefa existente
  updateTask(id: string, updates: Partial<Task>): void {
    this.tasks.update(currentTasks =>
      currentTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
    this.saveTasks();
  }

  // Remove uma tarefa
  deleteTask(id: string): void {
    this.tasks.update(currentTasks =>
      currentTasks.filter(task => task.id !== id)
    );
    this.saveTasks();
  }

  // Move uma tarefa para outro status (coluna)
  moveTask(id: string, newStatus: 'todo' | 'doing' | 'done'): void {
    this.updateTask(id, { status: newStatus });
  }

  // Retorna tarefas filtradas por status
  getTasksByStatus(status: 'todo' | 'doing' | 'done'): Task[] {
    return this.tasks().filter(task => task.status === status);
  }

  // Calcula a cor do indicador de proximidade baseado na data
  getProximityColor(dueISO: string): string {
    const today = new Date();
    const due = new Date(dueISO);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return 'bg-gray-500'; // Passou do prazo
    if (diff <= 1) return 'bg-red-500'; // Muito urgente
    if (diff <= 3) return 'bg-orange-400'; // Urgente
    if (diff <= 7) return 'bg-yellow-300'; // Próximo
    return 'bg-green-400'; // Tempo suficiente
  }
}
