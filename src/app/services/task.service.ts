import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'app_task_manager_tasks_v1';

  tasks = signal<Task[]>([]);

  constructor() {
    this.loadTasks();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  private addDaysISO(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  private loadTasks(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        this.seedTasks();
      } else {
        this.tasks.set(JSON.parse(raw));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas', error);
      this.tasks.set([]);
    }
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks()));
  }

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

  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: this.generateId()
    };
    this.tasks.update(currentTasks => [...currentTasks, newTask]);
    this.saveTasks();
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.tasks.update(currentTasks =>
      currentTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
    this.saveTasks();
  }

  deleteTask(id: string): void {
    this.tasks.update(currentTasks =>
      currentTasks.filter(task => task.id !== id)
    );
    this.saveTasks();
  }

  moveTask(id: string, newStatus: 'todo' | 'doing' | 'done'): void {
    this.updateTask(id, { status: newStatus });
  }

  getTasksByStatus(status: 'todo' | 'doing' | 'done'): Task[] {
    return this.tasks().filter(task => task.status === status);
  }

  getProximityColor(dueISO: string): string {
    const today = new Date();
    const due = new Date(dueISO);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return 'bg-gray-500';
    if (diff <= 1) return 'bg-red-500';
    if (diff <= 3) return 'bg-orange-400';
    if (diff <= 7) return 'bg-yellow-300';
    return 'bg-green-400';
  }
}
