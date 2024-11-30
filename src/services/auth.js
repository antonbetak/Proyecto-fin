import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth();
export { auth, onAuthStateChanged };

export const registerUser = async (email, password, additionalData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario registrado correctamente!", userCredential.user.uid);

        // Guardar datos adicionales en Firestore 
        const userRef = doc(db, 'Users', userCredential.user.uid); 
        await setDoc(userRef, {
            email: email,
            role: additionalData.role || 'user', 
            name: additionalData.name,
            createdAt: new Date()
        });

        return { user: userCredential.user, error: null };
    } catch (error) {
        console.error("Error creando usuario:", error.message);
        return { user: null, error: error.message };
    }
}

// Iniciar sesión 
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario inició sesión correctamente!", userCredential.user.uid);

        const userRef = doc(db, 'Users', userCredential.user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return { user: userCredential.user, role: userData.role, error: null };
        } else {
            console.error("No se encontró el rol del usuario.");
            return { user: null, error: "No se encontró el rol del usuario" };
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        return { user: null, error: error.message };
    }
}

// Cerrar sesión
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("Usuario cerró sesión");
        return { user: null, error: null };
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
        return { user: null, error: error.message };
    }
}
