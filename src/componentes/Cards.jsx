import React, { useState, useEffect } from "react";
import { collection, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const Cards = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  const toggleAvailability = async (id, currentStatus) => {
    const newStatus = currentStatus === "Disponible" ? "No Disponible" : "Disponible";
    const productRef = doc(db, "Products", id);
    await updateDoc(productRef, { Estado: newStatus });
  };

  const deleteProduct = async (id) => {
    const productRef = doc(db, "Products", id);
    await deleteDoc(productRef);
  };

  const startEditing = (product) => {
    setEditingProduct(product.id);
    setFormData({
      Nombre: product.Nombre,
      Descripcion: product.Descripcion,
      Precio: product.Precio,
    });
  };

  const saveChanges = async (id) => {
    const productRef = doc(db, "Products", id);
    await updateDoc(productRef, formData);
    setEditingProduct(null);
  };

  return (
    <div className="cards-container">
      {products.map((product) => (
        <div key={product.id} className="card">
          {editingProduct === product.id ? (
            <div className="space-y-4">
              <input
                type="text"
                name="Nombre"
                value={formData.Nombre}
                onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Nombre del Producto"
              />
              <input
                type="text"
                name="Descripcion"
                value={formData.Descripcion}
                onChange={(e) => setFormData({ ...formData, Descripcion: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Descripción"
              />
              <input
                type="number"
                name="Precio"
                value={formData.Precio}
                onChange={(e) => setFormData({ ...formData, Precio: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Precio"
              />
              <div className="card-actions">
                <button
                  onClick={() => saveChanges(product.id)}
                  className="card-button card-button-add"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="card-button card-button-delete"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="card-title">{product.Nombre}</h3>
              <p className="card-description">{product.Descripcion}</p>
              <p className="card-price">${product.Precio}</p>
              <div className="card-actions">
                <button
                  onClick={() => toggleAvailability(product.id, product.Estado)}
                  className={`card-button ${
                    product.Estado === "Disponible" ? "card-button-add" : "card-button-delete"
                  }`}
                >
                  {product.Estado === "Disponible"
                    ? "Marcar como no disponible"
                    : "Marcar como disponible"}
                </button>
                <button
                  onClick={() => startEditing(product)}
                  className="card-button card-button-add"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="card-button card-button-delete"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Cards;