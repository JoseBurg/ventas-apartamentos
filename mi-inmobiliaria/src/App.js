import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from './firebaseConfig'; // Importamos nuestra conexión a la DB

import PropertyCard from './components/PropertyCard';
import AddPropertyForm from './components/AddPropertyForm';
import './App.css';

// ----- DEFINICIÓN DE PÁGINAS O VISTAS (SOLO UNA VEZ) -----

function HomePage({ properties }) {
  return (
    <div>
      <h1 className="main-title">Propiedades Disponibles</h1>
      <div className="property-list">
        {properties.map(prop => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </div>
  );
}

function AdminPage({ properties, onAddProperty }) {
  const handleSendInfo = (property) => {
    const clientEmail = prompt(`¿A qué correo deseas enviar la información de "${property.title}"?`);
    if (clientEmail) {
      alert(`Información de ${property.title} enviada a ${clientEmail}. \n(Esto es una simulación)`);
    }
  };
  
  return (
    <div>
      <AddPropertyForm onAddProperty={onAddProperty} />
      <div className="admin-dashboard">
        <h2>Panel de Administración de Propiedades</h2>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Ubicación</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(prop => (
              <tr key={prop.id}>
                <td>{prop.title}</td>
                <td>{prop.location}</td>
                <td>${prop.price.toLocaleString()}</td>
                <td><span className="status-available">Disponible</span></td>
                <td><button onClick={() => handleSendInfo(prop)}>Enviar a Cliente</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ----- COMPONENTE PRINCIPAL DE LA APP -----

function App() {
  const [properties, setProperties] = useState([]);
  const propertiesCollectionRef = collection(db, "properties");

  useEffect(() => {
    const getProperties = async () => {
      try {
        const q = query(propertiesCollectionRef, orderBy("createdAt", "desc"));
        const data = await getDocs(q);
        const propertiesData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error al cargar las propiedades desde Firestore:", error);
      }
    };
    getProperties();
  }, [propertiesCollectionRef]);

  const addProperty = async (propertyData) => {
    try {
      const propertyWithTimestamp = {
        ...propertyData,
        createdAt: new Date()
      };
      const docRef = await addDoc(propertiesCollectionRef, propertyWithTimestamp);
      setProperties([{ ...propertyWithTimestamp, id: docRef.id }, ...properties]);
    } catch (error)
    {
      console.error("Error al agregar la propiedad a Firestore:", error);
    }
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <Link to="/">Inmobiliaria React</Link>
          <div className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/admin">Panel de Admin</Link>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage properties={properties} />} />
            <Route path="/admin" element={<AdminPage properties={properties} onAddProperty={addProperty} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;