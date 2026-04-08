export default function ProductoList({ productos, onEdit, onDelete, loading }) {
  if (loading) return <div className="card loading">Cargando productos...</div>

  return (
    <div className="card">
      <h2>📦 Productos ({productos.length})</h2>
      {productos.length === 0 ? (
        <p className="empty">No hay productos registrados aún.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>
                  <strong>{p.nombre}</strong>
                  {p.descripcion && <div style={{ fontSize: '0.78rem', color: '#999' }}>{p.descripcion}</div>}
                </td>
                <td><span className="badge">{p.categoria || 'Sin categoría'}</span></td>
                <td>${parseFloat(p.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
                <td style={{ color: p.stock < 5 ? '#e53935' : '#2e7d32', fontWeight: 600 }}>
                  {p.stock} uds
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-edit" onClick={() => onEdit(p)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => onDelete(p.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
