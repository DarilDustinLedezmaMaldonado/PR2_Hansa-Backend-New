// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

const required = (name: string, fallback?: string): string => {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var: ${name}`);
  return v as string;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),

  MONGO_URI: required("MONGO_URI"),
  JWT_SECRET: required("JWT_SECRET"),

  // Brevo Email
  BREVO_API_KEY: required("BREVO_API_KEY"),
  BREVO_FROM_EMAIL: required("BREVO_FROM_EMAIL"),
  BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || "Univalle - Plataforma Educativa",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),

  FRONTEND_URL: required("FRONTEND_URL", "http://localhost:5173"),

  RESET_TOKEN_TTL_MIN: Number(process.env.RESET_TOKEN_TTL_MIN || 20),

  RESEND_WINDOW_SEC: Number(process.env.RESEND_WINDOW_SEC || 600),
  RESEND_MAX_PER_WINDOW: Number(process.env.RESEND_MAX_PER_WINDOW || 3),
  RESEND_MIN_INTERVAL_SEC: Number(process.env.RESEND_MIN_INTERVAL_SEC || 60),
  TWOFA_TTL_MIN: Number(process.env.TWOFA_TTL_MIN || 5),
};
