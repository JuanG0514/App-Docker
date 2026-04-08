// Todas las llamadas van a /api/... 
// Nginx en producción redirige /api/ → backend:8080
const BASE = '/api/tasks'

export async function getTasks() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Error al obtener tareas')
  return res.json()
}

export async function createTask(task) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error('Error al crear tarea')
  return res.json()
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error('Error al actualizar tarea')
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar tarea')
}
