const UserModel = require('../model/user-model');
const ContactModel = require('../model/contacts-model');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const secretKey = process.env.JWT_SECRET_KEY;

console.log(process.env.TWILIO_ACCOUNT_SID);
console.log(process.env.TWILIO_AUTH_TOKEN);

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class UserController {
  // Controlador para obtener todos los usuarios
  getAllUsers = async (req, res) => {
    ContactModel.findAll().then().catch();

    try {
      const users = await ContactModel.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ message: 'Error al obtener los usuarios.' });
    }
  };

  // Controlador para agregar un nuevo usuario
  addUser = async (req, res) => {
    const { username, phone, email } = req.body;
    try {
      const newUser = await ContactModel.create({
        username,
        phone,
        email,
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      res.status(500).json({ message: 'Error al agregar el usuario.' });
    }
  };

  // Controlador para el login sin bcrypt
  login = async (req, res) => {
    const { username, password } = req.body;

    try {
      // Busca el usuario por nombre de usuario
      const user = await UserModel.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verifica la contraseña (comparación directa)
      if (password !== user.password) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Genera el token JWT
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, {
        expiresIn: '1h', // El token expirará en 1 hora
      });

      res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ message: 'Error en el login' });
    }
  };

  // Controlador para hacer una llamada usando Twilio
  callUser = async (req, res) => {
    const { phone } = req.body; // Número de teléfono destino

    try {
      // Realiza la llamada

      const call = await client.calls.create({
        to: phone, // El número al que se va a llamar
        from: '+523341637670', // Tu número de Twilio
        url: 'http://demo.twilio.com/welcome/voice/', // URL de TwiML que define cómo manejar la llamada
      });

      res.status(200).json({ message: 'Llamada realizada', callSid: call.sid });
    } catch (error) {
      console.error(error);
      console.error('Error al realizar la llamada:', error);
      res.status(500).json({ message: 'Error al realizar la llamada.' });
    }
  };

  // Controlador para enviar un mensaje de WhatsApp
  sendWhatsAppMessage = async (req, res) => {
    const { phone, message } = req.body; // Número de teléfono destino y mensaje

    try {
      const whatsappMessage = await client.messages.create({
        from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER, // Tu número de WhatsApp de Twilio
        to: 'whatsapp:' + phone, // El número al que se va a enviar el mensaje
        body: message, // El mensaje a enviar
      });

      res
        .status(200)
        .json({ message: 'Mensaje de WhatsApp enviado', messageSid: whatsappMessage.sid });
    } catch (error) {
      console.error('Error al enviar el mensaje de WhatsApp:', error);
      res.status(500).json({ message: 'Error al enviar el mensaje de WhatsApp.' });
    }
  };

  sendEmail = async (req, res) => {
    const { to, subject, content } = req.body;

    try {
      const email = await sgMail.send({
        to: to, // Destinatario del correo
        from: process.env.TWILIO_EMAIL_FROM, // Dirección de correo verificada en SendGrid
        subject: subject, // Asunto del correo
        text: content, // Cuerpo del correo en texto plano
      });

      res
        .status(200)
        .json({ message: 'Correo enviado', messageId: email[0].headers['x-message-id'] });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ message: 'Error al enviar el correo.' });
    }

    // Controlador para enviar un correo electrónico
    sendEmail = async (req, res) => {
      const { to, subject, content } = req.body;

      try {
        const email = await sgMail.send({
          to: to, // Destinatario del correo
          from: process.env.TWILIO_EMAIL_FROM, // Dirección de correo verificada en SendGrid
          subject: subject, // Asunto del correo
          text: content, // Cuerpo del correo en texto plano
        });

        res
          .status(200)
          .json({ message: 'Correo enviado', messageId: email[0].headers['x-message-id'] });
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo.' });
      }
    };
  };
}

module.exports = new UserController();
