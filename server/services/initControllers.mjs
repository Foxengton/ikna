import { app } from "../app.mjs";
import express from "express";
import registrationController from "../controllers/registrationContoller.mjs";
import loginController from "../controllers/loginContoller.mjs";

export default async function initControllers() {
  app.use(express.json());
  app.get("/api/register", (req, res) => registrationController(req, res));
  app.get("/api/login", (req, res) => loginController(req, res));
}
