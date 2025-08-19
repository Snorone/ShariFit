import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Mainbutton from "../components/mainbutton/Mainbutton";
import { createUserIfNotExists } from "../utils/createUserIfNotExists"; // <-- import

const Login = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Laddar auth...</p>;

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Inloggad som:", result.user.displayName);

      // ✅ Skapa användardokument och testdata
      await createUserIfNotExists();
    } catch (error) {
      console.error("Inloggning misslyckades:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Utloggad");
    } catch (error) {
      console.error("Utloggning misslyckades:", error);
    }
  };

  return user ? (
    <Mainbutton onClick={handleLogout}>Logga ut ({user.displayName})</Mainbutton>
  ) : (
    <Mainbutton onClick={handleLogin}>Logga in med Google</Mainbutton>
  );
};

export default Login;
