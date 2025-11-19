import fetch from "node-fetch";
import { env } from "../config/env";
import { 
  passwordResetTemplate, 
  welcomeTemplate, 
  notificationTemplate,
  invitationTemplate 
} from "../templates/emailTemplates";

// Brevo API para envío de emails
async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  textContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}) {
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
      subject,
      htmlContent,
      textContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo email error: ${error}`);
  }

  return response.json();
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, username: string = "Usuario") {
  const subject = "🔒 Restablece tu contraseña - Univalle";
  const htmlContent = passwordResetTemplate(resetUrl, username);
  const textContent = `Hola ${username}, recibimos una solicitud para restablecer tu contraseña. Visita este enlace: ${resetUrl} (expira en 20 minutos). Si no fuiste tú, ignora este mensaje.`;
  
  await sendBrevoEmail({ to, subject, htmlContent, textContent });
}

export async function sendWelcomeEmail(to: string, username: string) {
  const subject = "🎉 ¡Bienvenido/a a Univalle!";
  const htmlContent = welcomeTemplate(username);
  const textContent = `¡Hola ${username}! Bienvenido/a a la Plataforma Educativa Univalle. Tu cuenta ha sido creada exitosamente.`;
  
  await sendBrevoEmail({ to, subject, htmlContent, textContent });
}

export async function sendNotificationEmail(
  to: string, 
  title: string, 
  message: string, 
  actionUrl?: string, 
  actionText?: string
) {
  const subject = `🔔 ${title}`;
  const htmlContent = notificationTemplate(title, message, actionUrl, actionText);
  const textContent = `${title}\n\n${message.replace(/<[^>]*>/g, '')}${actionUrl ? `\n\nEnlace: ${actionUrl}` : ''}`;
  
  await sendBrevoEmail({ to, subject, htmlContent, textContent });
}

export async function sendInvitationEmail(
  to: string,
  username: string,
  repositoryName: string,
  inviterName: string,
  acceptUrl: string
) {
  const subject = `📨 Nueva invitación a "${repositoryName}"`;
  const htmlContent = invitationTemplate(username, repositoryName, inviterName, acceptUrl);
  const textContent = `Hola ${username}, ${inviterName} te ha invitado a colaborar en "${repositoryName}". Acepta la invitación en: ${acceptUrl}`;
  
  await sendBrevoEmail({ to, subject, htmlContent, textContent });
}
