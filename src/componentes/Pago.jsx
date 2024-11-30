import React, { useState, useEffect } from 'react';
import { createOrder } from '../services/orderService';
import emailjs from 'emailjs-com';

const Pago = ({ orden, clearOrden, onOrderSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
  const [splitCount, setSplitCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [ticket, setTicket] = useState('');

  const getTotalAmount = () => {
    return orden.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const [totalPerPerson, setTotalPerPerson] = useState(0);

  useEffect(() => {
    const totalAmount = getTotalAmount();
    if (splitCount > 0) {
      setTotalPerPerson(totalAmount / splitCount);
    }
  }, [splitCount, orden]);

  const handlePayment = async () => {
    if (customerName === '' || paymentMethod === '') {
      alert('Por favor, completa todos los campos');
      return;
    }

    const totalAmount = getTotalAmount();
    const splitPerPerson = totalAmount / splitCount;

    const order = {
      customerName: customerName,
      items: orden,
      payment: paymentMethod,
      timestamp: new Date(),
      splitAmounts: Array(splitCount).fill(splitPerPerson),
    };

    try {
      await createOrder(order);
      clearOrden();
      onOrderSuccess();
      setShowModal(false);
      setShowCardModal(false);
      setCardDetails({ cardNumber: '', expiryDate: '', cvv: '' });

      generateTicket(order, totalAmount, splitPerPerson);
      sendEmail(order, totalAmount, splitPerPerson);
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
  };

  const generateTicket = (order, totalAmount, splitPerPerson) => {
    const ticketData = `
      ------------------------
        TICKET DE PAGO
        Tu pedido está en 
        preparación
      ------------------------
      Cliente: ${order.customerName}
      Fecha: ${order.timestamp.toLocaleString()}
      
      Detalles de la Orden:
      ${order.items.map(item => `${item.name} x${item.quantity} - $${item.price}`).join('\n')}
      
    
      
      Método de Pago: ${order.payment}
      
      ------------------------
      ¡Gracias por su compra!
      ------------------------
    `;
    setTicket(ticketData);
    setShowTicketModal(true);
  };

  const sendEmail = (order, totalAmount, splitPerPerson) => {
    const templateParams = {
      customer_name: order.customerName,
      items: order.items.map(item => `${item.name} x${item.quantity} - $${item.price}`).join(', '),
      total_amount: totalAmount,
      split_per_person: splitPerPerson.toFixed(2),
      payment_method: order.payment,
      split_count: splitCount,
      timestamp: order.timestamp.toLocaleString(),
    };

    emailjs.send('service_coijrnr', 'template_kwttt6n', templateParams, 'E3WYl4yZJVVqis7X3')
      .then(response => {
        console.log('Correo enviado con éxito:', response);
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
      });
  };

  const handleSplitChange = (e) => {
    const newCount = parseInt(e.target.value);
    if (isNaN(newCount) || newCount < 1) {
      return;
    }
    setSplitCount(newCount);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'Tarjeta') {
      setShowCardModal(true);
    } else {
      setShowCardModal(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif',fontWeight:'bold'}}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '20px 40px',
            backgroundColor: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px',
            fontSize: '16px',
          }}
        >
          Pagar
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          color: '#333',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          zIndex: 1000,
          width: '300px'
        }}>
          <h3>Confirmación de Pago</h3>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Nombre del Cliente:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Método de Pago:</label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => handlePaymentMethodChange('Tarjeta')}
                style={{
                  padding: '10px 20px',
                  margin: '0 10px',
                  backgroundColor: paymentMethod === 'Tarjeta' ? '#333' : '#ccc',
                  color: paymentMethod === 'Tarjeta' ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Tarjeta
              </button>
              <button
                onClick={() => handlePaymentMethodChange('Efectivo')}
                style={{
                  padding: '10px 20px',
                  margin: '0 10px',
                  backgroundColor: paymentMethod === 'Efectivo' ? '#333' : '#ccc',
                  color: paymentMethod === 'Efectivo' ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Efectivo
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Dividir la cuenta entre:</label>
            <input
              type="number"
              value={splitCount}
              onChange={handleSplitChange}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <span> Personas</span>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Total por persona:</label>
            <div>
              <strong>${totalPerPerson.toFixed(2)}</strong>
            </div>
          </div>

          <button
            onClick={handlePayment}
            style={{
              padding: '10px 20px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Confirmar Pago
          </button>

          <button
            onClick={() => setShowModal(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              width: '100%',
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      {showTicketModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          color: '#333',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          zIndex: 1000,
          width: '300px'
        }}>
          <h3>Ticket de Pago</h3>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {ticket}
          </pre>
          <button
            onClick={() => setShowTicketModal(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Pago;
