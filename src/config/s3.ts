// src/config/s3.ts
// NOTA: S3 no está en uso actualmente. Se usa Cloudinary en su lugar.
// Descomentar y configurar si se necesita AWS S3 en el futuro.

/*
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const s3Client =
  env.AWS_REGION && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
        },
      })
    : undefined;
*/

export const s3Client: undefined = undefined;
