// Interface que define a estrutura de uma tarefa
export interface Task {
  id: string;
  title: string;
  due: string; // Data no formato ISO (YYYY-MM-DD)
  level: 'low' | 'medium' | 'high'; // Nível de prioridade
  desc: string; // Descrição da tarefa
  status: 'todo' | 'doing' | 'done'; // Status atual da tarefa
}
