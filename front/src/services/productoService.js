import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// FIX: interceptor global de errores para tener mensajes útiles en toda la app
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message
      || error.response?.statusText
      || error.message
      || 'Error de red'
    return Promise.reject(new Error(msg))
  }
)

export const productoService = {
  getAll:   ()         => api.get('/productos'),
  getById:  (id)       => api.get(`/productos/${id}`),
  create:   (data)     => api.post('/productos', data),
  update:   (id, data) => api.put(`/productos/${id}`, data),
  delete:   (id)       => api.delete(`/productos/${id}`)
}
