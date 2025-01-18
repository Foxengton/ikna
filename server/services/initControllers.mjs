import { app } from "../app.mjs";
import express from "express";
import registrationController from "../controllers/registrationContoller.mjs";

export default async function initControllers() {
  app.use(express.json());
  app.put("/api/register", (req, res) => registrationController(req, res));
}
