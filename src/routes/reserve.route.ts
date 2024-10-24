import { Router } from "express";
import { grillaCrossfit } from "@/mockup_grilla_horaria/mockup_grilla";
import { firestoreDB } from "@/FirebaseDB/firebase.admin";
import type { Request, Response } from "express";

const reserveCollectionRef = firestoreDB.collection("crossfit");
export const reserveRouter = Router();

// Ruta para agregar reserva por usuarioId , dia y hora
// debo reservar cuando creo la grilla y ademas
const AddReserve = (req: Request, res: Response) => {
  const { userId, day, hour } = req.body;
  console.log(userId, day, hour);

  reserveCollectionRef
    .doc(new Date().toDateString())
    .get()
    .then((doc) => {
      if (!doc.exists) {
        reserveCollectionRef
          .doc(new Date().toDateString())
          .set(grillaCrossfit)
          .then(() => {
            const grillaSnapShot = reserveCollectionRef
              .doc(new Date().toDateString())
              .get();
            grillaSnapShot.then((doc) => {
              console.log(doc.data());
            });
            res
              .status(200)
              .send({ message: "Reserva creada con éxito", id: doc.id });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Error al crear la reserva",
              error: error.message,
            });
          });
      } else {
        const grilla = doc.data();
        if (grilla && grilla[day]) {
          if (grilla[day][hour].length < 16) {
            const arrayDeHorarios = grilla[day][hour];
            if (arrayDeHorarios.includes(userId)) {
              res.status(500).send({ message: "Ya se encuentra reservado" });
              return;
            } else {
              arrayDeHorarios.push(userId);

              doc.ref.update(`${day}.${hour}`, arrayDeHorarios);

              res.status(200).send({ message: "Turno agregado con exito" });
              return;
            }
          } else {
            res.status(500).send({ message: "No hay mas cupos disponibles" });
          }
        }
      }
    });

  // const reserveCrossfitRef = reserveCollectionRef.doc(
  //   new Date().toDateString()
  // );

  // reserveCrossfitRef.set(new Date()).then((res) => {
  //   console.log(res);
  // });
};

const getReserve = (req: Request, res: Response) => {};

reserveRouter.post("/addReserve", AddReserve);
