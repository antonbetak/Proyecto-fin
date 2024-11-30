import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, limit, onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// create a new order
export const createOrder = async (order) => {
    try {
        const docRef = await addDoc(collection(db, "Orders"), order);
        console.log("documento creado con id: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("error al crear el pedido: ", error);
    }
};

// read all orders
export const getOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "Orders"));
    const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    console.log(dataList);
    return dataList;
};

