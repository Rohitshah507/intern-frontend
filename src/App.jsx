import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./Components/Common/RouteGuards";

// Layouts
import UserLayout from "./Components/User/UserLayout";
import AdminLayout from "./Components/Admin/AdminLayout";

// User Pages
import Home from "./Pages/Admin/User/Home";
import Login from "./Pages/Admin/User/Login";
import Signup from "./Pages/Admin/User/Signup";
import { ForgotPassword, ResetPassword } from "./Pages/Admin/User/PasswordReset";
import Vehicles from "./Pages/Admin/User/Vehicles";
import VehicleDetail from "./Pages/Admin/User/VehicleDetail";
import BookVehicle from "./Pages/Admin/User/BookVehicle";
import MyBookings from "./Pages/Admin/User/MyBookings";

// Admin Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminVehicles from "./Pages/Admin/AdminVehicles";
import AdminBookings from "./Pages/Admin/AdminBookings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* User Layout Routes */}
          <Route element={<UserLayout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />

            {/* Guest-only (redirect if logged in) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected user routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/book/:id" element={<BookVehicle />} />
            </Route>
          </Route>

          {/* Admin Layout Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/vehicles" element={<AdminVehicles />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
