// setAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "YGLV0JEpwrbEmLdnR2jOWtyNl1J3";

async function setAdminRole() {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    console.log("✅ Användaren har fått admin-roll!");
  } catch (error) {
    console.error("❌ Fel vid sättning av admin-roll:", error);
  }
}

setAdminRole();




