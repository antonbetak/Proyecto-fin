import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import emailjs from 'emailjs-com';
import './Orders.css';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setNewOrderCount(data.length);

      const savedStatus = JSON.parse(localStorage.getItem('orderStatus')) || {};
      const updatedOrders = data.map(order => {
        order.status = savedStatus[order.id] || 'En preparación';
        return order;
      });

      setOrders(updatedOrders);
    };

    fetchOrders();
  }, []);

  const sendEmail = (order) => {
    const templateParams = {
      order_id: order.id,
      customer_name: order.customerName,
      items: order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
      order_status: order.status,
      timestamp: new Date(order.timestamp.seconds * 1000).toLocaleString(),
    };

    emailjs.send('service_coijrnr', 'template_vfvq0hm', templateParams, 'E3WYl4yZJVVqis7X3')
      .then(response => {
        console.log('Correo enviado con éxito:', response);
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
      });
  };

  const handleOrderStatusChange = (orderId, status) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        order.status = status;
        if (status === 'Listo') {
          sendEmail(order);
          return null; 
        }
      }
      return order;
    }).filter(order => order !== null);

    const updatedStatus = {};
    updatedOrders.forEach(order => {
      updatedStatus[order.id] = order.status;
    });

    localStorage.setItem('orderStatus', JSON.stringify(updatedStatus));
    setOrders(updatedOrders);
  };

  return (
    <div className="orders-container">
      <h2 className="order-header">
        Tienes {newOrderCount} {newOrderCount === 1 ? 'orden nueva' : 'órdenes nuevas'}
      </h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3 className="order-title">Orden #{order.id}</h3>
            <p className="order-date"><strong>Fecha:</strong> {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
            <h4 className="order-items-title">Ítems:</h4>
            <ul className="order-items">
              {order.items?.map((item) => (
                <li key={item.name} className="order-item">
                  {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                </li>
              ))}
            </ul>
            <div className="order-actions">
              <button
                onClick={() => handleOrderStatusChange(order.id, 'Listo')}
                className={`order-btn ${order.status === 'Listo' ? 'ready' : 'default'}`}
              >
                Listo
              </button>
              <button
                onClick={() => handleOrderStatusChange(order.id, 'En preparación')}
                className={`order-btn ${order.status === 'En preparación' ? 'preparing' : 'default'}`}
              >
                En preparación
              </button>
            </div>
            {order.status && <p className="order-status"><strong>Estado:</strong> {order.status}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
