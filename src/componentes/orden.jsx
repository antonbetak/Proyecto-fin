// orden.jsx
import React from 'react';

const Orden = ({ orden, clearOrden }) => {
  const total = orden.reduce((acc, item) => acc + item.price * item.Quantity, 0);

  
};

export default Orden;
