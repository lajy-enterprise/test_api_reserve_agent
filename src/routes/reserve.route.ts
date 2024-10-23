import { Router } from "express";
import { firestoreDB } from "@/FirebaseDB/firebase.admin";
import type { Request, Response } from "express";

const reserveCollectionRef = firestoreDB.collection("reserves");
export const reserveRouter = Router();

// Ruta para agregar reserva por usuario, dia y hora
const AddReserve = (req: Request, res: Response) => {
  const { userId, day, hour } = req.body;
  const newReserve = {
    userId,
    day,
    hour,
  };

  const docReserveRef = reserveCollectionRef.doc();
  docReserveRef
    .set(newReserve)
    .then(() => {
      res.status(201).json({ message: "Reserve added", id: docReserveRef.id });
    })
    .catch((error) => {
      res.status(500).send("Error adding reserve: " + error);
    });
};

reserveRouter.post("/addReserve", AddReserve);
