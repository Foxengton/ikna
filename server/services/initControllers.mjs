import { app } from "../app.mjs";
import express from "express";
import registrationController from "../controllers/registrationContoller.mjs";
import loginController from "../controllers/loginContoller.mjs";
import addDeckContoller from "../controllers/addDeckContoller.mjs";
import deleteDeckContoller from "../controllers/deleteDeckContoller.mjs";
import addCardContoller from "../controllers/addCardContoller.mjs";
import deleteCardContoller from "../controllers/deleteCardContoller.mjs";

export default async function initControllers() {
  app.use(express.json());
  app.get("/api/register", (req, res) => registrationController(req, res));
  app.get("/api/login", (req, res) => loginController(req, res));
  app.get("/api/deck/add", (req, res) => addDeckContoller(req, res));
  app.get("/api/deck/delete", (req, res) => deleteDeckContoller(req, res));
  app.get("/api/card/add", (req, res) => addCardContoller(req, res));
  app.get("/api/card/delete", (req, res) => deleteCardContoller(req, res));
}
