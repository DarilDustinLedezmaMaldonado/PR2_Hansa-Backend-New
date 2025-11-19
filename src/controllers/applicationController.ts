import { Request, Response } from "express";
import Application from "../models/Application";
import Repository from "../models/Repository";
import Notification from "../models/Notification";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

// POST /api/applications/creator/:repoId
export const applyCreator = async (req: Request, res: Response): Promise<void> => {
  try {
    const repoId = req.params.repoId;
    const applicantId = new mongoose.Types.ObjectId((req as any).user.id);
    const { creatorType, aporte, motivacion, tipoAporte, disponibilidadHoras, urlPortafolio } = req.body;

    const repo = await Repository.findById(repoId);
    if (!repo || repo.typeRepo !== "creator") {
      res.status(400).json({ message: "Repositorio no válido para esta acción" });
      return;
    }

    // 🚫 Evitar aplicaciones duplicadas
    const existing = await Application.findOne({
      repo: repoId,
      applicant: applicantId,
      kind: "creator",
      status: { $in: ["pending", "accepted"] },
    });
    if (existing) {
      res.status(400).json({ message: "Ya tienes una aplicación activa para este repositorio" });
      return;
    }

    const app = await Application.create({
      kind: "creator",
      repo: repo._id,
      applicant: applicantId,
      creatorType,
      aporte,
      motivacion,
      tipoAporte,
      disponibilidadHoras,
      urlPortafolio,
    });

    // 📩 Notifica al owner
    await Notification.create({
      user: repo.owner,
      type: "creator_new_application",
      title: "Nueva aplicación como Creador",
      message: "Un usuario ha solicitado unirse como Creador.",
      repo: repo._id,
      application: app._id,
      actor: applicantId,
    });

    logger.info(`[Application] ${applicantId} aplicó a ${repo.name} como Creador`);
    res.status(201).json({ message: "Aplicación enviada", application: app });
  } catch (err) {
    logger.error("Error al aplicar como Creador:", err);
    res.status(500).json({ message: "Error al aplicar" });
  }
};

// POST /api/applications/member/:repoId
export const applyMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const repoId = req.params.repoId;
    const applicantId = new mongoose.Types.ObjectId((req as any).user.id);
    const { plan, aportePersonal = [], amount } = req.body;

    const repo = await Repository.findById(repoId);
    if (!repo || repo.typeRepo !== "creator") {
      res.status(400).json({ message: "Repositorio no válido para esta acción" });
      return;
    }

    // 🚫 Evitar aplicaciones duplicadas
    const existing = await Application.findOne({
      repo: repoId,
      applicant: applicantId,
      kind: "member",
      status: { $in: ["pending", "accepted"] },
    });
    if (existing) {
      res.status(400).json({ message: "Ya te has unido o aplicado a este repositorio" });
      return;
    }

    // 🧾 Crear aplicación como aceptada automáticamente
    const app = await Application.create({
      kind: "member",
      repo: repo._id,
      applicant: applicantId,
      plan,
      aportePersonal,
      amount,
      status: "accepted",
      decidedBy: applicantId,
      decidedAt: new Date(),
    });

    // Agregar directamente al repo
    const exists = repo.participants.some((p: any) => (p.user as any).equals(applicantId));
    if (!exists) {
      repo.participants.push({ user: applicantId, role: "writer", status: "active" } as any);
      await repo.save();
    }

    // 📩 Notificar al owner
    await Notification.create({
      user: repo.owner,
      type: "creator_member_joined",
      title: "Nuevo miembro en tu Repositorio Creador",
      message: "Un usuario se ha unido directamente como miembro.",
      repo: repo._id,
      actor: applicantId,
    });

    logger.info(`[Application] ${applicantId} se unió directamente como Miembro a ${repo.name}`);
    res.status(201).json({ message: "Te has unido al repositorio", application: app });
  } catch (err) {
    logger.error("Error al aplicar como Miembro:", err);
    res.status(500).json({ message: "Error al aplicar" });
  }
};

// GET /api/applications/repo/:repoId
export const listApplicationsByRepo = async (req: Request, res: Response): Promise<void> => {
  try {
    const repoId = req.params.repoId;
    const apps = await Application.find({ repo: repoId })
      .sort({ createdAt: -1 })
      .populate("applicant", "username email");
    res.status(200).json(apps);
  } catch (err) {
    logger.error("Error al listar aplicaciones:", err);
    res.status(500).json({ message: "Error al listar aplicaciones" });
  }
};

// PUT /api/applications/:id/accept
export const acceptApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const approverId = new mongoose.Types.ObjectId((req as any).user.id);

    const app = await Application.findById(id);
    if (!app) {
      res.status(404).json({ message: "Aplicación no encontrada" });
      return;
    }

    const repo = await Repository.findById(app.repo);
    if (!repo) {
      res.status(404).json({ message: "Repositorio no encontrado" });
      return;
    }

    // 🔒 Solo owner o admin pueden aceptar
    const isAllowed =
      repo.owner.equals(approverId) ||
      repo.participants.some((p: any) => p.user.equals(approverId) && p.role === "admin");
    if (!isAllowed) {
      res.status(403).json({ message: "No autorizado para aceptar esta solicitud" });
      return;
    }

    app.status = "accepted";
    app.decidedBy = approverId;
    app.decidedAt = new Date();
    await app.save();

    // Agrega al repo con rol writer
    const exists = repo.participants.some((p: any) => (p.user as any).equals(app.applicant));
    if (!exists) {
      repo.participants.push({ user: app.applicant, role: "writer", status: "active" } as any);
      await repo.save();
    }

    // 📩 Notificar al solicitante
    await Notification.create({
      user: app.applicant,
      type: "creator_creator_accepted",
      title: "Tu aplicación fue aceptada",
      message: "Ahora formas parte del repositorio como colaborador.",
      repo: repo._id,
      application: app._id,
      actor: approverId,
    });

    logger.info(`[Application] ${app._id} aceptada por ${approverId}`);
    res.status(200).json({ message: "Aplicación aceptada" });
  } catch (err) {
    logger.error("Error al aceptar aplicación:", err);
    res.status(500).json({ message: "Error al aceptar" });
  }
};

// PUT /api/applications/:id/reject
export const rejectApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const approverId = new mongoose.Types.ObjectId((req as any).user.id);

    const app = await Application.findById(id);
    if (!app) {
      res.status(404).json({ message: "Aplicación no encontrada" });
      return;
    }

    const repo = await Repository.findById(app.repo);
    if (!repo) {
      res.status(404).json({ message: "Repositorio no encontrado" });
      return;
    }

    // 🔒 Validar permisos
    const isAllowed =
      repo.owner.equals(approverId) ||
      repo.participants.some((p: any) => p.user.equals(approverId) && p.role === "admin");
    if (!isAllowed) {
      res.status(403).json({ message: "No autorizado para rechazar" });
      return;
    }

    app.status = "rejected";
    app.decidedBy = approverId;
    app.decidedAt = new Date();
    await app.save();

    // 📩 Notificar al solicitante
    await Notification.create({
      user: app.applicant,
      type: "creator_application_rejected",
      title: "Tu aplicación fue rechazada",
      message: "El owner ha rechazado tu solicitud.",
      repo: repo._id,
      application: app._id,
      actor: approverId,
    });

    logger.info(`[Application] ${app._id} rechazada por ${approverId}`);
    res.status(200).json({ message: "Aplicación rechazada" });
  } catch (err) {
    logger.error("Error al rechazar aplicación:", err);
    res.status(500).json({ message: "Error al rechazar" });
  }
};
