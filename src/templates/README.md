# 📧 Sistema de Emails Profesionales - Univalle

Este directorio contiene las plantillas HTML profesionales para todos los correos electrónicos enviados por la plataforma.

## 🎨 Características

- ✅ **Diseño Responsivo**: Optimizado para todos los dispositivos
- ✅ **Colores Institucionales**: Usa la paleta de colores de Univalle
- ✅ **Plantillas Reutilizables**: Sistema modular de plantillas
- ✅ **Accesibilidad**: Compatible con lectores de pantalla
- ✅ **Fallback de Texto**: Incluye versión texto plano para todos los emails

## 📋 Plantillas Disponibles

### 1. **Código de Verificación (2FA)**
```typescript
verificationCodeTemplate(code: string, username: string)
```
- Usado para autenticación de dos factores
- Muestra el código de 6 dígitos destacado
- Incluye advertencia de expiración (5 minutos)

### 2. **Restablecimiento de Contraseña**
```typescript
passwordResetTemplate(resetUrl: string, username: string)
```
- Envía enlace seguro para restablecer contraseña
- Botón CTA destacado con gradiente
- Advertencia de expiración (20 minutos)
- Incluye enlace alternativo por si el botón no funciona

### 3. **Bienvenida**
```typescript
welcomeTemplate(username: string)
```
- Enviado automáticamente al registrarse
- Presenta las características de la plataforma
- Botón para comenzar a usar la aplicación

### 4. **Notificaciones Generales**
```typescript
notificationTemplate(title: string, message: string, actionUrl?: string, actionText?: string)
```
- Plantilla flexible para cualquier notificación
- Soporte opcional para botón de acción
- Acepta HTML en el mensaje

### 5. **Invitaciones a Repositorios**
```typescript
invitationTemplate(username: string, repositoryName: string, inviterName: string, acceptUrl: string)
```
- Notifica sobre invitaciones a colaborar
- Muestra quién invita y a qué proyecto
- Botón para aceptar la invitación

## 🎨 Paleta de Colores

```css
--color-primary: #9D0045      /* Vino Univalle */
--color-primarytwo: #C73872    /* Rosa Univalle */
--color-primaryfaint: #f8dee8  /* Rosa claro */
--color-secondary: #808185     /* Gris */
--color-accent: #FF7E5F        /* Naranja */
```

## 🔧 Uso en Controladores

### Enviar Email de Verificación
```typescript
import { sendVerificationEmail } from '../utils/sendEmail';

await sendVerificationEmail(user.email, code, user.username);
```

### Enviar Email de Reset de Contraseña
```typescript
import { sendPasswordResetEmail } from '../services/mailer';

await sendPasswordResetEmail(user.email, resetUrl, user.username);
```

### Enviar Email de Bienvenida
```typescript
import { sendWelcomeEmail } from '../services/mailer';

await sendWelcomeEmail(user.email, user.username);
```

### Enviar Notificación Personalizada
```typescript
import { sendNotificationEmail } from '../services/mailer';

await sendNotificationEmail(
  user.email,
  'Nuevo Comentario',
  '<p>Alguien comentó en tu publicación.</p>',
  'https://app.univalle.com/post/123',
  'Ver Comentario'
);
```

### Enviar Invitación
```typescript
import { sendInvitationEmail } from '../services/mailer';

await sendInvitationEmail(
  user.email,
  user.username,
  'Proyecto de Física Cuántica',
  'Dr. Juan Pérez',
  'https://app.univalle.com/invitation/accept/abc123'
);
```

## 📱 Compatibilidad

Las plantillas han sido probadas y son compatibles con:

- ✅ Gmail (Web, iOS, Android)
- ✅ Outlook (Web, Desktop, iOS, Android)
- ✅ Apple Mail (macOS, iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

## 🔒 Seguridad

- **No incluir información sensible** directamente en los emails
- Los enlaces de reset/verificación usan **tokens únicos** de un solo uso
- Todos los enlaces tienen **tiempo de expiración**
- Se incluye **versión texto plano** como fallback

## 🚀 Mejoras Futuras

- [ ] Agregar plantilla para confirmación de email
- [ ] Plantilla para notificación de nuevo archivo compartido
- [ ] Plantilla para resumen semanal de actividad
- [ ] Soporte para múltiples idiomas
- [ ] Sistema de plantillas con variables dinámicas

## 📝 Notas

- Todas las plantillas usan **tablas HTML** para máxima compatibilidad
- Los estilos están **inline** para evitar problemas con clientes de email
- Se incluye **fallback text** para cuando HTML no está disponible
- El footer incluye enlaces de política de privacidad y términos de uso
