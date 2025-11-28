// src/modules/laws/law.routes.ts

import { Router } from "express";
import { lawController } from "./law.controller";

const router = Router();

router.get("/", (req, res) => lawController.getAll(req, res));
router.get("/:id", (req, res) => lawController.getById(req, res));
router.post("/", (req, res) => lawController.create(req, res));

export default router;
