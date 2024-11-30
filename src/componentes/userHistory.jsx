import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const UserHistory = ({ loggedInUserName }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Función para obtener las órdenes desde Firebase
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Orders"));
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Órdenes obtenidas:", ordersData);  
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  
  useEffect(() => {
    fetchOrders();
  }, []);

  
  const handleSearch = () => {
    if (!loggedInUserName) {
      console.error("No user logged in.");
      return;
    }

   
    const matchingOrders = orders.filter(
      (order) =>
        order.customerName &&
        order.customerName.toLowerCase() === loggedInUserName.toLowerCase()
    );
    console.log("Órdenes filtradas:", matchingOrders);
    setFilteredOrders(matchingOrders);
  };

 
  const handleClear = () => {
    setFilteredOrders([]);
  };

  return (
    <div className="user-history-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Consultar mi Historial</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Buscar
        </button>
      </div>

      
      {filteredOrders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                width: '80%',
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#f4f4f4',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              <h3>{order.customerName} - Orden #{order.id}</h3>
              <p><strong>Fecha de la orden:</strong> {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
              <div>
                {order.items.map((item, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <p><strong>Producto:</strong> {item.name}</p>
                    <p><strong>Cantidad:</strong> {item.quantity}</p>
                    <p><strong>Precio:</strong> ${item.price}</p>
                    <p><strong>Descripción:</strong> {item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredOrders.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleClear}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px',
            }}
          >
            Ocultar
          </button>
        </div>
      )}

    
      {filteredOrders.length === 0 && (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#888' }}>
          No se encontraron órdenes para este usuario.
        </p>
      )}
    </div>
  );
};

export default UserHistory;

