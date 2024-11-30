import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [ordenItems, setOrdenItems] = useState([]);

  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(products);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const addToOrden = (item) => {
    setOrdenItems((prevItems) => [...prevItems, item]);
  };

  const removeFromOrden = (item) => {
    setOrdenItems((prevItems) => prevItems.filter((ordenItem) => ordenItem.id !== item.id));
  };

  const clearOrden = () => {
    setOrdenItems([]);
  };

  const getTotal = () => {
    return ordenItems.reduce((total, item) => total + parseFloat(item.Precio), 0);
  };

  return (
    <div>
      <h2 className="text-center text-white text-3xl font-bold mb-8">Menú</h2>

      <div className="cards-container">
        {menuItems.map((item) => (
          <div key={item.id} className="card">
            <h3 className="card-title">{item.Nombre}</h3>
            <p className="card-description">{item.Descripcion}</p>
            <p className="card-price">${item.Precio}</p>
            <div className="card-actions">
              <button onClick={() => addToOrden(item)} className="card-button card-button-add">
                Agregar
              </button>
              <button onClick={() => removeFromOrden(item)} className="card-button card-button-delete">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h3 className="text-2xl font-bold text-white">Órdenes agregadas:</h3>
        {ordenItems.length > 0 ? (
          <ul className="list-none mt-4">
            {ordenItems.map((item, index) => (
              <li key={index} className="text-white text-lg">
                {item.Nombre} - ${item.Precio}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 mt-4">No has agregado ningún ítem a la orden.</p>
        )}

        {ordenItems.length > 0 && (
          <h3 className="text-2xl font-bold text-green-400 mt-4">Total: ${getTotal()}</h3>
        )}

        <button onClick={clearOrden} className="card-button card-button-delete mt-4">
          Limpiar orden
        </button>
      </div>
    </div>
  );
};

export default Menu;
