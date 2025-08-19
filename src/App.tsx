import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./firebase/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/profile/Profile";
import Layout from "./layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import Bmi from "./pages/bmi/Bmi";
import Exercises from "./pages/exercises/Exercises";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bmi" element={<Bmi />} />
            <Route path="/exercises" element={<Exercises />} />

          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
