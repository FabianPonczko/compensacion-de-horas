// backend/src/routes/auth.routes.js

import express from 'express';

import {
  register,
  login,
} from '../controllers/auth.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ======================================
// REGISTER
// POST /api/auth/register
// ======================================

router.post(
  '/register',
  register
);

// ======================================
// LOGIN
// POST /api/auth/login
// ======================================

router.post(
  '/login',
  login
);



export default router;