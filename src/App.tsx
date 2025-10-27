import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./firebase/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/profile/Profile";
import Layout from "./layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import Bmi from "./pages/bmi/Bmi";
import Workouts from "./pages/workouts/workoutspage";
import AdminPage from "./pages/admin/adminPage";
import AdminRoute from "./components/adminRoute";
import Meals from "./pages/meals/mealsPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bmi" element={<Bmi />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/meals" element={<Meals />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
