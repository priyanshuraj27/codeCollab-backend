import { Router } from "express";
import {
  createCollab,
  getParticipants,
  getOwner,
  updateContent,
} from "../controllers/collab.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const collabRouter = Router();

// 🔒 Protected Routes
collabRouter.post("/create", verifyJWT, createCollab);
collabRouter.get("/get-participants/:collabId", verifyJWT, getParticipants);
collabRouter.get("/get-owner/:collabId", verifyJWT, getOwner);
collabRouter.patch("/update-content/:collabId", verifyJWT, updateContent);

export default collabRouter;
