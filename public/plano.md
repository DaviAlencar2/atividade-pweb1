PLANO DE IMPLEMENTAÇÃO:
1. Corrigir configuração do Tailwind
Renomear postcssrc.json para .postcssrc.json (adicionar ponto no início)
Reiniciar servidor de desenvolvimento
2. Criar o Serviço de Dados (TaskService)
Criar interface Task com tipagem (id, title, due, level, desc, status)
Implementar service com signals para gerenciar estado das tarefas
Adicionar métodos: loadTasks(), saveTasks(), addTask(), updateTask(), deleteTask(), moveTask()
Implementar seed inicial de tarefas (3 tarefas exemplo)
Integrar com localStorage
3. Criar Componente Principal (TaskBoardComponent)
Estrutura com header, botão de adicionar, e grid de 3 colunas
Injetar TaskService via DI
Consumir signals do service
Implementar lógica de abertura/fechamento do modal
4. Criar Componente de Card de Tarefa (TaskCardComponent)
Receber task como @Input
Implementar eventos de editar/excluir (@Output)
Implementar drag-and-drop (dragstart/dragend)
Mostrar indicador de proximidade (dot colorido)
Exibir título, data, nível e descrição
5. Criar Componente de Formulário Modal (TaskFormComponent)
Formulário reativo com campos: título, data, nível, descrição
Receber task para edição via @Input (opcional)
Emitir evento @Output ao salvar
Implementar backdrop e botão de fechar
Validação de campos obrigatórios
6. Implementar Drag and Drop
Adicionar diretivas/eventos de drag nos cards
Implementar drop zones nas colunas
Chamar service para atualizar status da tarefa
7. Estilização com Tailwind
Aplicar todas as classes Tailwind do projeto original
Manter layout responsivo (grid adaptativo)
Estilizar modal, cards, botões e formulário
8. Ajustes Finais
Testar todas as funcionalidades (CRUD completo)
Verificar persistência no localStorage
Validar sistema de cores de proximidade
Testar drag-and-drop entre colunas