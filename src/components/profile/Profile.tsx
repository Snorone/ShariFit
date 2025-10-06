import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { Role } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) return <p>Du måste vara inloggad för att se profilsidan.</p>;

  const isAdmin = user.role === Role.ADMIN; // 👈 kolla roll

  return (
    <div className="profile">
      <div className="profile-card">
        <img
          className="profile-image"
          src={user.photoURL || ""}
          alt="Profilbild"
        />
        <h2>{user.displayName}</h2>
        <p>{user.email}</p>

        <div className="profile-buttons">
          <button onClick={() => navigate("/exercises")}>
            📋 Mina övningar
          </button>
          <button onClick={() => navigate("/meals")}> Mina måltider</button>
          <button onClick={() => navigate("/bmi")}>📊 BMI & hälsa</button>

          {/* 👇 Bara admin ser den här knappen */}
          {isAdmin && (
            <button onClick={() => navigate("/admin")}>🔑 Adminpanel</button>
          )}

          <button onClick={handleLogout}>🚪 Logga ut</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
