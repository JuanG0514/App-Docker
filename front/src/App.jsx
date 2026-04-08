import { useState, useEffect } from 'react'
import { productoService } from './services/productoService'
import ProductoForm from './components/ProductoForm'
import ProductoList from './components/ProductoList'

export default function App() {
  const [productos, setProductos] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)

  const notify = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const res = await productoService.getAll()
      setProductos(res.data)
    } catch {
      notify('Error al cargar productos. Verifica que el backend esté activo.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProductos() }, [])

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await productoService.update(editing.id, data)
        notify('Producto actualizado correctamente')
        setEditing(null)
      } else {
        await productoService.create(data)
        notify('Producto creado correctamente')
      }
      fetchProductos()
    } catch {
      notify('Error al guardar el producto', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await productoService.delete(id)
      notify('Producto eliminado')
      fetchProductos()
    } catch {
      notify('Error al eliminar el producto', 'error')
    }
  }

  return (
    <>
      <header>
        <span style={{ fontSize: '1.5rem' }}>🏪</span>
        <h1>Sistema de Inventario</h1>
      </header>

      <div className="container">
        {msg && (
          <div className={msg.type === 'error' ? 'error-msg' : 'success-msg'}>
            {msg.text}
          </div>
        )}

        <ProductoForm
          onSubmit={handleSubmit}
          editing={editing}
          onCancel={() => setEditing(null)}
        />

        <ProductoList
          productos={productos}
          onEdit={setEditing}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </>
  )
}
