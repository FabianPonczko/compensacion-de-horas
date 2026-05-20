import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generarToken } from '../utils/generarToken.js';

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await User.findOne({ email });

    if (existe) {
      return res.status(400).json({
        message: 'El usuario ya existe',
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      token: generarToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Credenciales inválidas',
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: 'Credenciales inválidas',
      });
    }

    res.json({
      token: generarToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};