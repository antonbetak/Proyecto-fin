import React, { useState } from "react";

const AddProduct = ({ handleAddProduct }) => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Precio: "",
    Descripcion: "",
    Estado: "Disponible",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewProduct = async (e) => {
    e.preventDefault();
    try {
      handleAddProduct(formData);
      setFormData({
        Nombre: "",
        Precio: "",
        Descripcion: "",
        Estado: "Disponible",
      });
      console.log("Producto añadido exitosamente.");
    } catch (error) {
      console.error("Error añadiendo el producto: ", error);
    }
  };

  return (
    <div className="add-product-container">
      <h1 className="add-product-title">Añadir Producto</h1>
      <form onSubmit={handleAddNewProduct} className="add-product-form">
        <div className="form-field">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">Precio</label>
          <input
            type="number"
            name="Precio"
            value={formData.Precio}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">Descripción</label>
          <textarea
            name="Descripcion"
            value={formData.Descripcion}
            onChange={handleInputChange}
            className="form-input"
            required
          ></textarea>
        </div>
        <div className="form-field">
          <label className="form-label">Estado</label>
          <select
            name="Estado"
            value={formData.Estado}
            onChange={handleInputChange}
            className="form-input"
            required
          >
            <option value="Disponible">Disponible</option>
            <option value="No Disponible">No Disponible</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="form-button form-button-save">
            Añadir al Menú
          </button>
          <button
            type="button"
            className="form-button form-button-cancel"
            onClick={() =>
              setFormData({
                Nombre: "",
                Precio: "",
                Descripcion: "",
                Estado: "Disponible",
              })
            }
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
