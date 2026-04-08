import { useState } from 'react'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await onAdd({ title: title.trim(), description: description.trim(), completed: false })
      setTitle('')
      setDescription('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nueva tarea..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={120}
        />
        <button style={styles.btn} type="submit" disabled={loading || !title.trim()}>
          {loading ? '...' : '+'}
        </button>
      </div>
      <textarea
        style={styles.textarea}
        placeholder="Descripción (opcional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
      />
    </form>
  )
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '32px',
  },
  row: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    background: 'var(--surface2)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '15px',
    transition: 'border-color 0.2s',
  },
  textarea: {
    background: 'var(--surface2)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    color: 'var(--text)',
    fontSize: '14px',
    resize: 'vertical',
    width: '100%',
  },
  btn: {
    background: 'var(--accent)',
    color: '#000',
    fontFamily: 'var(--font-head)',
    fontWeight: 700,
    fontSize: '22px',
    borderRadius: 'var(--radius)',
    padding: '0 20px',
    transition: 'background 0.2s, transform 0.1s',
    minWidth: '52px',
  },
}
