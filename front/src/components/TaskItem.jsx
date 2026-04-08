import { useState } from 'react'

export default function TaskItem({ task, onToggle, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await onDelete(task.id)
  }

  return (
    <div style={{ ...styles.card, opacity: deleting ? 0.4 : 1 }}>
      <button
        style={{
          ...styles.check,
          background: task.completed ? 'var(--accent)' : 'transparent',
          borderColor: task.completed ? 'var(--accent)' : 'var(--border)',
        }}
        onClick={() => onToggle(task)}
        title={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div style={styles.content}>
        <span style={{
          ...styles.title,
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? 'var(--text-muted)' : 'var(--text)',
        }}>
          {task.title}
        </span>
        {task.description && (
          <span style={styles.desc}>{task.description}</span>
        )}
      </div>

      <button
        style={styles.del}
        onClick={handleDelete}
        disabled={deleting}
        title="Eliminar"
      >
        ✕
      </button>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 18px',
    transition: 'border-color 0.2s, opacity 0.3s',
  },
  check: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
    transition: 'background 0.2s, border-color 0.2s',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '15px',
    fontWeight: 400,
    transition: 'color 0.2s',
  },
  desc: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  del: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '13px',
    padding: '4px 6px',
    borderRadius: '6px',
    flexShrink: 0,
    transition: 'color 0.2s',
  },
}
