import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './style.css'
import { normalizeCarritoItem } from './data/productos'

// Páginas
import Home from './pages/Home'
import Productos from './pages/producto'
import Carrito from './pages/carrito'
import Login from './pages/login'
import Registro from './pages/registro'
import Perfil from './pages/perfil'
import Contactos from './pages/contactos'
import Reserva from './pages/reserva'
import AdminPanel from './pages/admin_panel'
import LoginAdmin from './pages/loginAdmin'
import Bienvenida from './pages/bienvenida'
import ProductoDetalle from './pages/ProductoDetalle'

// Componentes
import Header from './pages/Header'
import Footer from './pages/Footer'

function cargarUsuarioActivo() {
  const usuarioActivo = localStorage.getItem('usuarioActivo')

  if (!usuarioActivo) {
    return null
  }

  try {
    return JSON.parse(usuarioActivo)
  } catch {
    return usuarioActivo
  }
}

function cargarCarrito() {
  try {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || []
    return Array.isArray(carritoGuardado) ? carritoGuardado.map(normalizeCarritoItem) : []
  } catch {
    return []
  }
}

function ProtectedAdmin() {
  const adminActivo = localStorage.getItem('adminActivo')

  if (!adminActivo) {
    return <Navigate to="/login-admin" replace />
  }

  return <AdminPanel />
}

function App() {
  const [usuario, setUsuario] = useState(cargarUsuarioActivo)
  const [carrito, setCarrito] = useState(cargarCarrito)

  const actualizarCarrito = (nuevoCarrito) => {
    const carritoNormalizado = nuevoCarrito.map(normalizeCarritoItem)
    setCarrito(carritoNormalizado)
    localStorage.setItem('carrito', JSON.stringify(carritoNormalizado))
  }

  return (
    <Router>
      <Header usuario={usuario} carrito={carrito} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bienvenida" element={<Bienvenida />} />
          <Route path="/productos" element={<Productos carrito={carrito} actualizarCarrito={actualizarCarrito} />} />
          <Route path="/producto/:id" element={<ProductoDetalle carrito={carrito} actualizarCarrito={actualizarCarrito} />} />
          <Route path="/carrito" element={<Carrito usuario={usuario} carrito={carrito} actualizarCarrito={actualizarCarrito} />} />
          <Route path="/login" element={usuario ? <Navigate to="/perfil" /> : <Login setUsuario={setUsuario} />} />
          <Route path="/registro" element={usuario ? <Navigate to="/perfil" /> : <Registro setUsuario={setUsuario} />} />
          <Route path="/perfil" element={usuario ? <Perfil usuario={usuario} setUsuario={setUsuario} /> : <Navigate to="/login" />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/reserva" element={<Reserva usuario={usuario} />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
