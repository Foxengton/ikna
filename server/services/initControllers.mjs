import { app } from "../app.mjs";
import express from "express";
import registrationController from "../controllers/registrationContoller.mjs";
import loginController from "../controllers/loginContoller.mjs";
import addDeckContoller from "../controllers/addDeckContoller.mjs";
import deleteDeckContoller from "../controllers/deleteDeckContoller.mjs";
import addCardContoller from "../controllers/addCardContoller.mjs";
import deleteCardContoller from "../controllers/deleteCardContoller.mjs";
import listDecksContoller from "../controllers/listDecksContoller.mjs";
import listCardsContoller from "../controllers/listCardsContoller.mjs";

export default async function initControllers() {
  app.use(express.json());
  app.post("/api/register", (req, res) => registrationController(req, res));
  app.post("/api/login", (req, res) => loginController(req, res));
  app.post("/api/deck/list", (req, res) => listDecksContoller(req, res));
  app.post("/api/deck/add", (req, res) => addDeckContoller(req, res));
  app.post("/api/deck/delete", (req, res) => deleteDeckContoller(req, res));
  app.post("/api/card/add", (req, res) => addCardContoller(req, res));
  app.post("/api/card/delete", (req, res) => deleteCardContoller(req, res));
  app.post("/api/card/list", (req, res) => listCardsContoller(req, res));
}
