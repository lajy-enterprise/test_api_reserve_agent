import { Router } from "express";
import { grillaHoraria } from "@/mockup_grilla_horaria/mockup_grilla";
import { firestoreDB } from "@/FirebaseDB/firebase.admin";
import type { Request, Response } from "express";
import dayjs from "dayjs";

export const reserveRouter = Router();

// Ruta para obtener dispinibilidad
const getDisponibility = (req: Request, res: Response) => {
  const {
    day,
    activityQuery,
    hour,
  }: { day: string; activityQuery: string; hour: string } = req.body;
  const dateFormat = dayjs(day);
  const date = dateFormat.toDate().toDateString();
  console.log("date de getDisponibility", date);
  console.log("ac de getDisponibility", activityQuery);
  console.log("hour de getDisponibility", hour);

  if (date.includes("Sun")) {
    res
      .status(500)
      .send({ message: "No hay turnos disponibles para los dias domingo" });
    return;
  }

  const reserveCollectionRef = firestoreDB.collection(activityQuery);
  reserveCollectionRef
    .doc(date)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(200).send({
          message:
            "Hay turnos disponibles para " + activityQuery + " el día " + day,
        });
      } else if (doc.exists) {
        const grilla = doc.data();
        if (grilla && grilla[hour]) {
          if (grilla[hour].length < 16) {
            return res.send({
              message:
                "Hay turnos disponibles para " +
                activityQuery +
                " el día " +
                day,
            });
          } else {
            return res.send({
              message:
                "No hay mas cupos disponibles para " +
                activityQuery +
                " el día " +
                day,
            });
          }
        } else {
          return res.status(500).send({
            message: "Ha ocurrido un error al consultar la disponibilidad",
          });
        }
      }
    });
};

// Ruta para agregar reserva por usuarioId , dia y hora
// debo reservar cuando creo la grilla y ademas
const AddReserve = (req: Request, res: Response) => {
  const { userId, day, hour, activity } = req.body;
  const dateFormat = dayjs(day);
  const date = dateFormat.toDate().toDateString();
  const reserveCollectionRef = firestoreDB.collection(activity);
  reserveCollectionRef
    .doc(date)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        reserveCollectionRef
          .doc(date)
          .set(grillaHoraria)
          .then(() => {
            const grillaSnapShot = reserveCollectionRef.doc(date).get();
            grillaSnapShot.then((doc) => {
              const grilla = doc.data();

              if (grilla && grilla[hour]) {
                if (grilla[hour].length < 16) {
                  const arrayDeHorarios = grilla[hour];
                  if (arrayDeHorarios.includes(userId)) {
                    res.status(500).send({
                      message:
                        "El usuario ya tiene una reserva activa en este horario",
                    });
                    return;
                  } else {
                    arrayDeHorarios.push(userId);

                    doc.ref.update(`${hour}`, arrayDeHorarios);

                    res
                      .status(200)
                      .send({ message: "Turno agregado con exito" });
                    return;
                  }
                } else {
                  res.status(500).send({
                    message: "No hay mas cupos disponibles en este horario",
                  });
                }
              } else {
                return res.status(500).send({
                  message: "Un error ocurrio al intentar generar la grilla",
                });
              }
              // console.log(doc.data());
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Error al crear la reserva",
              error: error.message,
            });
          });
      } else {
        const grilla = doc.data();
        if (grilla && grilla[hour]) {
          if (grilla[hour].length < 16) {
            const arrayDeHorarios = grilla[hour];
            if (arrayDeHorarios.includes(userId)) {
              res.status(500).send({
                message:
                  "El usuario ya tiene una reserva activa en este horario",
              });
              return;
            } else {
              arrayDeHorarios.push(userId);

              doc.ref.update(`${hour}`, arrayDeHorarios);

              res.status(200).send({ message: "Turno agregado con exito" });
              return;
            }
          } else {
            res.status(500).send({
              message: "No hay mas cupos disponibles en este horario",
            });
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
reserveRouter.post("/getDisponibility", getDisponibility);
