import { useState, useEffect } from 'react'

const EMPTY = { nombre: '', descripcion: '', precio: '', stock: '', categoria: '' }

export default function ProductoForm({ onSubmit, editing, onCancel }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre || '',
        descripcion: editing.descripcion || '',
        precio: editing.precio || '',
        stock: editing.stock || '',
        categoria: editing.categoria || ''
      })
    } else {
      setForm(EMPTY)
    }
  }, [editing])

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock)
    })
    setForm(EMPTY)
  }

  return (
    <div className="card">
      <h2>{editing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
      <form onSubmit={submit}>
        <div>
          <label>Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handle} required placeholder="Ej: Laptop Dell" />
        </div>
        <div>
          <label>Categoría</label>
          <input name="categoria" value={form.categoria} onChange={handle} placeholder="Ej: Electrónica" />
        </div>
        <div>
          <label>Precio *</label>
          {/* FIX: min="0" evita precios negativos */}
          <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handle} required placeholder="0.00" />
        </div>
        <div>
          <label>Stock *</label>
          {/* FIX: min="0" evita stock negativo */}
          <input name="stock" type="number" min="0" value={form.stock} onChange={handle} required placeholder="0" />
        </div>
        <div className="full-width">
          <label>Descripción</label>
          <input name="descripcion" value={form.descripcion} onChange={handle} placeholder="Descripción del producto..." />
        </div>
        <div className="actions full-width">
          {editing && (
            <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
          )}
          <button type="submit" className="btn btn-primary">
            {editing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
