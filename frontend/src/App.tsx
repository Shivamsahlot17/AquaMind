import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stations from "./pages/Stations";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Sensors from "./pages/Sensors";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard/GW001" replace />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard/:stationId"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Stations */}
        <Route
          path="/stations"
          element={
            <ProtectedRoute>
              <Stations />
            </ProtectedRoute>
          }
        />

        {/* Protected Sensors */}
        <Route
          path="/sensors"
          element={
            <ProtectedRoute>
              <Sensors />
            </ProtectedRoute>
          }
        />

        {/* Protected Alerts */}
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        {/* Protected Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Protected Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Protected Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;