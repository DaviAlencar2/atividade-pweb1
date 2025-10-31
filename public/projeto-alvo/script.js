// Simple task manager for study tasks
// Data model: { id, title, due (ISO date), level: low|medium|high, desc, status: todo|doing|done }

const STORAGE_KEY = 'app_task_manager_tasks_v1'

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7) }

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedTasks()
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load tasks', e)
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function seedTasks() {
  const tasks = [
    { 
      id: uid(), 
      title: 'Ler capítulo 3 de Algoritmos', 
      due: addDaysISO(2), 
      level: 'high', 
      desc: 'Priorizar exercícios 3.1-3.5', 
      status: 'todo' },
    { id: uid(), title: 'Resolver lista de TS', due: addDaysISO(5), level: 'medium', desc: 'Atenção a generics', status: 'doing' },
    { id: uid(), title: 'Revisão rápida: HTML/CSS', due: addDaysISO(10), level: 'low', desc: '30 minutos', status: 'done' }
  ]
  saveTasks(tasks)
  return tasks
}

function addDaysISO(n){
  const d = new Date()
  d.setDate(d.getDate()+n)
  return d.toISOString().slice(0,10)
}

function proximityColor(dueISO){
  const today = new Date()
  const due = new Date(dueISO)
  const diff = Math.ceil((due - today) / (1000*60*60*24))
  if (diff < 0) return 'bg-gray-500' // passed
  if (diff <= 1) return 'bg-red-500'
  if (diff <= 3) return 'bg-orange-400'
  if (diff <= 7) return 'bg-yellow-300'
  return 'bg-green-400'
}

function render() {
  const tasks = loadTasks()
  const cols = { todo: document.getElementById('col-todo'), doing: document.getElementById('col-doing'), done: document.getElementById('col-done') }
  Object.values(cols).forEach(c => c.innerHTML='')

  tasks.forEach(t => {
    const card = document.createElement('div')
    card.className = 'p-3 border rounded bg-white shadow-sm cursor-move'
    card.draggable = true
    card.dataset.id = t.id

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-3">
          <span class="dot ${proximityColor(t.due)}" title="Proximidade"></span>
          <div>
            <div class="font-semibold text-slate-800">${escapeHtml(t.title)}</div>
            <div class="text-xs text-slate-500">Término: ${t.due} • ${levelLabel(t.level)}</div>
          </div>
        </div>
        <div class="text-right">
          <button class="text-xs text-slate-500 mr-2 btn-edit">Editar</button>
          <button class="text-xs text-red-500 btn-del">Excluir</button>
        </div>
      </div>
      <p class="mt-2 text-sm text-slate-600">${escapeHtml(t.desc || '')}</p>
    `

    // events
    card.querySelector('.btn-del').addEventListener('click', e => {
      e.stopPropagation()
      deleteTask(t.id)
    })
    card.querySelector('.btn-edit').addEventListener('click', e => {
      e.stopPropagation()
      startEditTask(t)
    })

    card.addEventListener('dragstart', onDragStart)
    card.addEventListener('dragend', onDragEnd)

    cols[t.status].appendChild(card)
  })

  // enable drop
  Object.values(cols).forEach(col => {
    col.addEventListener('dragover', onDragOver)
    col.addEventListener('drop', onDrop)
  })
}

function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }
function levelLabel(l){ return l==='high' ? 'Alta' : l==='medium' ? 'Média' : 'Baixa' }

function onDragStart(e){
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id)
  e.currentTarget.classList.add('opacity-70')
}
function onDragEnd(e){ e.currentTarget.classList.remove('opacity-70') }
function onDragOver(e){ e.preventDefault() }
function onDrop(e){
  e.preventDefault()
  const id = e.dataTransfer.getData('text/plain')
  const col = e.currentTarget.closest('[data-status]')
  if (!col) return
  moveTaskTo(id, col.dataset.status)
}

function moveTaskTo(id, status){
  const tasks = loadTasks()
  const idx = tasks.findIndex(t=>t.id===id)
  if (idx === -1) return
  tasks[idx].status = status
  saveTasks(tasks)
  render()
}

function deleteTask(id){
  let tasks = loadTasks()
  tasks = tasks.filter(t=>t.id!==id)
  saveTasks(tasks)
  render()
}

function startEditTask(task){
  // populate form and open modal for editing
  document.getElementById('title').value = task.title
  document.getElementById('due').value = task.due
  document.getElementById('level').value = task.level
  document.getElementById('desc').value = task.desc || ''
  // store editing id
  document.getElementById('task-form').dataset.editing = task.id
  openModal()
}

function onFormSubmit(e){
  e.preventDefault()
  const id = document.getElementById('task-form').dataset.editing
  const title = document.getElementById('title').value.trim()
  const due = document.getElementById('due').value
  const level = document.getElementById('level').value
  const desc = document.getElementById('desc').value.trim()
  if (!title || !due) return

  const tasks = loadTasks()
  if (id) {
    const idx = tasks.findIndex(t=>t.id===id)
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], title, due, level, desc }
    }
    delete document.getElementById('task-form').dataset.editing
  } else {
    tasks.push({ id: uid(), title, due, level, desc, status: 'todo' })
  }
  saveTasks(tasks)
  e.target.reset()
  closeModal()
  render()
}

// Modal helpers
function openModal(){
  const m = document.getElementById('form-modal')
  if (!m) return
  m.classList.remove('hidden')
}
function closeModal(){
  const m = document.getElementById('form-modal')
  if (!m) return
  m.classList.add('hidden')
  // clear editing state
  delete document.getElementById('task-form').dataset.editing
  document.getElementById('task-form').reset()
}

// wire modal open/close buttons
document.getElementById('open-form-btn').addEventListener('click', () => openModal())
document.getElementById('close-form-btn').addEventListener('click', () => closeModal())
// close when clicking backdrop
document.querySelectorAll('[data-modal-backdrop]').forEach(b => b.addEventListener('click', () => closeModal()))

// wire up
document.getElementById('task-form').addEventListener('submit', onFormSubmit)

// Initialization
render()

// Expose some helpers for debugging (optional)
window._app = { loadTasks, saveTasks, render }