const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar los cuerpos de las solicitudes en formato JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de CORS
const whitelist = ['https://javer.com.mx', 'https://www.javer.com.mx', 'http://127.0.0.1:5501'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Acceso no autorizado'));
    }
  },
};
app.use(cors(corsOptions));

// Ruta para manejar el envío del formulario
app.post("/enviar-correo", (req, res) => {
  const { nombre, email, mensaje } = req.body;

  // Configurar el transporte del correo electrónico usando nodemailer
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "reno7882@gmail.com", // Cambiar por tu dirección de correo desde donde se enviarán los correos
      pass: "hvxg lsjg ypkz avpw", // Cambiar por la contraseña de tu correo
    },
  });

  // Configurar los datos del correo
  let mailOptions = {
    from: "reno7882@gmail.com", // Cambiar por tu dirección de correo
    to: "rceron@javer.com.mx", // Dirección de correo a la que se enviará el formulario
    subject: "Nuevo mensaje desde el formulario de contacto",
    text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`,
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo:", error);
      res.status(500).send("Hubo un error al enviar el correo");
    } else {
      console.log("Correo enviado: %s", info.response);
      res.status(200).send("Correo enviado correctamente");
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
