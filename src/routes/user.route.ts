import { firestoreDB } from "@/FirebaseDB/firebase.admin";
import type { User } from "@/types/firestore.types";
import type { Request, Response } from "express";
import { Router } from "express";
export const userRouter = Router();
const userCollectionRef = firestoreDB.collection("users");

const addUser = async (req: Request, res: Response) => {
  const { userName, email, dni }: User = req.body as any;
  const newUser = {
    userName,
    email,
    dni,
  };

  const docRef = userCollectionRef.doc(dni);
  docRef
    .set(newUser)
    .then(() => {
      res.status(201).send("User added");
    })
    .catch((error) => {
      res.status(500).send("Error adding user: " + error);
    });
};

userRouter.post("/addUser", addUser);
