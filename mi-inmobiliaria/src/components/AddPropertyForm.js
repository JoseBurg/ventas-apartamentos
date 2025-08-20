import React, { useState } from 'react';
import './AddPropertyForm.css'; // Estilos para el formulario

function AddPropertyForm({ onAddProperty }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !location || !price || !rooms) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newProperty = {
      id: Date.now(), // ID único basado en la fecha actual
      title,
      location,
      price: Number(price),
      rooms: Number(rooms),
      imageUrl: 'https://via.placeholder.com/300x200', // Imagen de ejemplo
    };

    onAddProperty(newProperty); // Llama a la función del componente padre
    
    // Limpiar el formulario
    setTitle('');
    setLocation('');
    setPrice('');
    setRooms('');
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      <h2>Agregar Nueva Propiedad</h2>
      <input
        type="text"
        placeholder="Título (Ej: Apartamento en Piantini)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio (USD)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Habitaciones"
        value={rooms}
        onChange={(e) => setRooms(e.target.value)}
      />
      <button type="submit">Agregar Propiedad</button>
    </form>
  );
}

export default AddPropertyForm;