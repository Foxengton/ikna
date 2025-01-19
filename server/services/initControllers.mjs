import { app } from "../app.mjs";
import express from "express";
import registrationController from "../controllers/registrationContoller.mjs";
import loginController from "../controllers/loginContoller.mjs";
import addDeckContoller from "../controllers/addDeckContoller.mjs";

export default async function initControllers() {
  app.use(express.json());
  app.get("/api/register", (req, res) => registrationController(req, res));
  app.get("/api/login", (req, res) => loginController(req, res));
  app.get("/api/decks/add", (req, res) => addDeckContoller(req, res));
}
