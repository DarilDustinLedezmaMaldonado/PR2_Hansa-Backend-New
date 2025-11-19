import fetch from 'node-fetch';
import { env } from '../config/env';
import { verificationCodeTemplate } from '../templates/emailTemplates';

export const sendVerificationEmail = async (to: string, code: string, username: string = 'Usuario') => {
  const htmlContent = verificationCodeTemplate(code, username);
  const textContent = `Hola ${username}, tu código de verificación es: ${code}. Este código expira en 5 minutos.`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: env.BREVO_FROM_NAME,
        email: env.BREVO_FROM_EMAIL,
      },
      to: [{ email: to }],
      subject: '🔐 Tu código de verificación - Univalle',
      htmlContent,
      textContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al enviar email de verificación: ${error}`);
  }

  return response.json();
};
