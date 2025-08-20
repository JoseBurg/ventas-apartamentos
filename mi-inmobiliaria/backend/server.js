// 1. Importar librerías
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Importamos mongoose

// 2. Inicializar la aplicación
const app = express();
const PORT = 5000;

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar a la base de datos de MongoDB
const uri = process.env.MONGO_URI; // Obtenemos la URI desde las variables de entorno
mongoose.connect(uri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// 5. Definir el Schema y el Modelo de Mongoose
// El Schema es la estructura que tendrán nuestros documentos en la colección.
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rooms: { type: Number, required: true },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300x200' },
  createdAt: { type: Date, default: Date.now }
});

// El Modelo es un "molde" que nos permite crear, leer, actualizar y borrar
// documentos en la colección 'properties' de nuestra base de datos.
const Property = mongoose.model('Property', propertySchema);

// 6. Actualizar las rutas de la API para usar el Modelo

// GET /api/properties -> Devuelve todas las propiedades desde la DB
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 }); // Busca todos los documentos y los ordena por fecha de creación
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las propiedades', error });
  }
});

// POST /api/properties -> Guarda una nueva propiedad en la DB
app.post('/api/properties', async (req, res) => {
  try {
    // Creamos una nueva instancia del modelo Property con los datos del frontend
    const newProperty = new Property({
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
      rooms: req.body.rooms,
      imageUrl: req.body.imageUrl || 'https://via.placeholder.com/300x200'
    });

    const savedProperty = await newProperty.save(); // Guardamos el documento en la base de datos
    res.status(201).json(savedProperty); // Respondemos con el documento guardado
  } catch (error) {
    res.status(400).json({ message: 'Error al guardar la propiedad', error });
  }
});

// 7. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});