import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Registros from '../pages/Registros';
import Sabados from '../pages/Sabados';
import Reportes from '../pages/Reportes';
import Register from '../pages/Register';

import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={<Login />}
        />
        {/* REGISTRO */}
        <Route
          path="/register"
          element={<Register />}
        />
        {/* PRIVATE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registros"
          element={
            <ProtectedRoute>
              <Registros />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sabados"
          element={
            <ProtectedRoute>
              <Sabados />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}