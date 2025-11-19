// src/templates/emailTemplates.ts

/**
 * Plantilla base HTML para emails profesionales
 * Usa los colores institucionales de Univalle
 */

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Univalle - Plataforma Educativa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Container principal -->
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    
                    <!-- Header con gradiente Univalle -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #9D0045 0%, #C73872 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                🎓 Univalle
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #f8dee8; font-size: 14px; font-weight: 500;">
                                Plataforma Educativa
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 13px; line-height: 1.6;">
                                Este es un correo automático, por favor no responder.
                            </p>
                            <p style="margin: 0; color: #6c757d; font-size: 13px;">
                                © ${new Date().getFullYear()} Universidad del Valle. Todos los derechos reservados.
                            </p>
                            <div style="margin-top: 15px;">
                                <a href="#" style="color: #9D0045; text-decoration: none; font-size: 12px; margin: 0 10px;">Política de Privacidad</a>
                                <span style="color: #dee2e6;">|</span>
                                <a href="#" style="color: #9D0045; text-decoration: none; font-size: 12px; margin: 0 10px;">Términos de Uso</a>
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

/**
 * Plantilla para código de verificación 2FA
 */
export const verificationCodeTemplate = (code: string, username: string) => {
    const content = `
        <div style="text-align: center;">
            <div style="background: linear-gradient(135deg, #f8dee8 0%, #ffffff 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 10px 0; color: #9D0045; font-size: 24px; font-weight: 700;">
                    ¡Hola ${username}! 👋
                </h2>
                <p style="margin: 0; color: #424346; font-size: 16px; line-height: 1.6;">
                    Tu código de verificación está listo
                </p>
            </div>
            
            <div style="background-color: #f8f9fa; border: 2px dashed #9D0045; border-radius: 12px; padding: 30px; margin: 30px 0;">
                <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                    Tu Código de Verificación
                </p>
                <div style="background: linear-gradient(135deg, #9D0045 0%, #C73872 100%); border-radius: 8px; padding: 20px; display: inline-block;">
                    <span style="color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${code}
                    </span>
                </div>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: left;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                    ⚠️ <strong>Importante:</strong> Este código expira en <strong>5 minutos</strong>. Por tu seguridad, nunca compartas este código con nadie.
                </p>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; line-height: 1.8; margin: 25px 0;">
                Si no solicitaste este código, puedes ignorar este mensaje de forma segura.
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Plantilla para restablecimiento de contraseña
 */
export const passwordResetTemplate = (resetUrl: string, username: string) => {
    const content = `
        <div>
            <h2 style="margin: 0 0 20px 0; color: #9D0045; font-size: 24px; font-weight: 700;">
                Hola ${username} 👋
            </h2>
            
            <p style="margin: 0 0 20px 0; color: #424346; font-size: 16px; line-height: 1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en la Plataforma Educativa Univalle.
            </p>
            
            <div style="background: linear-gradient(135deg, #f8dee8 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin: 25px 0;">
                <p style="margin: 0 0 20px 0; color: #424346; font-size: 15px; line-height: 1.6;">
                    Haz clic en el botón de abajo para crear una nueva contraseña:
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #9D0045 0%, #C73872 100%); 
                              color: #ffffff; 
                              padding: 16px 40px; 
                              border-radius: 30px; 
                              text-decoration: none; 
                              font-weight: 700; 
                              font-size: 16px;
                              box-shadow: 0 4px 15px rgba(157, 0, 69, 0.3);
                              transition: all 0.3s ease;">
                        🔒 Restablecer Contraseña
                    </a>
                </div>
            </div>
            
            <div style="background-color: #e7f3ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; color: #0c5280; font-size: 14px; font-weight: 600;">
                    ℹ️ Este enlace expira en 20 minutos
                </p>
                <p style="margin: 0; color: #0c5280; font-size: 13px; line-height: 1.6;">
                    Si el botón no funciona, copia y pega este enlace en tu navegador:
                </p>
                <p style="margin: 10px 0 0 0; word-break: break-all;">
                    <a href="${resetUrl}" style="color: #0ea5e9; font-size: 13px;">${resetUrl}</a>
                </p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                    ⚠️ <strong>¿No solicitaste este cambio?</strong><br>
                    Si no fuiste tú quien solicitó restablecer la contraseña, ignora este mensaje. Tu cuenta está segura.
                </p>
            </div>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Plantilla para bienvenida de nuevos usuarios
 */
export const welcomeTemplate = (username: string) => {
    const content = `
        <div style="text-align: center;">
            <div style="background: linear-gradient(135deg, #f8dee8 0%, #ffffff 100%); border-radius: 12px; padding: 40px; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="margin: 0 0 15px 0; color: #9D0045; font-size: 28px; font-weight: 700;">
                    ¡Bienvenido/a a Univalle!
                </h2>
                <p style="margin: 0; color: #424346; font-size: 18px; font-weight: 500;">
                    Hola ${username}, estamos felices de tenerte aquí
                </p>
            </div>
            
            <div style="text-align: left; margin: 30px 0;">
                <p style="margin: 0 0 20px 0; color: #424346; font-size: 16px; line-height: 1.8;">
                    Tu cuenta ha sido creada exitosamente. Ahora puedes acceder a todos los recursos educativos de nuestra plataforma.
                </p>
                
                <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #9D0045; font-size: 18px; font-weight: 700;">
                        📚 ¿Qué puedes hacer ahora?
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #424346; font-size: 15px; line-height: 2;">
                        <li>Explorar repositorios de materiales educativos</li>
                        <li>Crear y compartir tus propios proyectos</li>
                        <li>Colaborar con otros estudiantes</li>
                        <li>Acceder a contenido exclusivo</li>
                    </ul>
                </div>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                   style="display: inline-block; 
                          background: linear-gradient(135deg, #9D0045 0%, #C73872 100%); 
                          color: #ffffff; 
                          padding: 16px 40px; 
                          border-radius: 30px; 
                          text-decoration: none; 
                          font-weight: 700; 
                          font-size: 16px;
                          box-shadow: 0 4px 15px rgba(157, 0, 69, 0.3);">
                    🚀 Comenzar Ahora
                </a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; line-height: 1.8; margin: 25px 0;">
                Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Plantilla para notificaciones generales
 */
export const notificationTemplate = (
    title: string, 
    message: string, 
    actionUrl?: string, 
    actionText?: string
) => {
    const content = `
        <div>
            <div style="background: linear-gradient(135deg, #f8dee8 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #9D0045; font-size: 22px; font-weight: 700;">
                    🔔 ${title}
                </h2>
            </div>
            
            <div style="color: #424346; font-size: 16px; line-height: 1.8; margin: 25px 0;">
                ${message}
            </div>
            
            ${actionUrl && actionText ? `
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${actionUrl}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #9D0045 0%, #C73872 100%); 
                              color: #ffffff; 
                              padding: 14px 35px; 
                              border-radius: 30px; 
                              text-decoration: none; 
                              font-weight: 700; 
                              font-size: 15px;
                              box-shadow: 0 4px 15px rgba(157, 0, 69, 0.3);">
                        ${actionText}
                    </a>
                </div>
            ` : ''}
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Plantilla para invitaciones a repositorios
 */
export const invitationTemplate = (
    username: string,
    repositoryName: string,
    inviterName: string,
    acceptUrl: string
) => {
    const content = `
        <div>
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 50px; margin-bottom: 15px;">📨</div>
                <h2 style="margin: 0 0 10px 0; color: #9D0045; font-size: 24px; font-weight: 700;">
                    Nueva Invitación
                </h2>
            </div>
            
            <p style="margin: 0 0 20px 0; color: #424346; font-size: 16px; line-height: 1.6;">
                Hola <strong>${username}</strong>,
            </p>
            
            <div style="background: linear-gradient(135deg, #f8dee8 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #424346; font-size: 15px;">
                    <strong>${inviterName}</strong> te ha invitado a colaborar en:
                </p>
                <p style="margin: 0; color: #9D0045; font-size: 20px; font-weight: 700;">
                    "${repositoryName}"
                </p>
            </div>
            
            <p style="margin: 20px 0; color: #424346; font-size: 16px; line-height: 1.8;">
                Aceptar esta invitación te permitirá contribuir y acceder a los recursos compartidos en este repositorio.
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${acceptUrl}" 
                   style="display: inline-block; 
                          background: linear-gradient(135deg, #9D0045 0%, #C73872 100%); 
                          color: #ffffff; 
                          padding: 16px 40px; 
                          border-radius: 30px; 
                          text-decoration: none; 
                          font-weight: 700; 
                          font-size: 16px;
                          box-shadow: 0 4px 15px rgba(157, 0, 69, 0.3);">
                    ✅ Aceptar Invitación
                </a>
            </div>
            
            <div style="background-color: #e7f3ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; color: #0c5280; font-size: 14px; line-height: 1.6;">
                    ℹ️ Esta invitación es personal y no puede ser transferida a otra cuenta.
                </p>
            </div>
        </div>
    `;
    return baseTemplate(content);
};
