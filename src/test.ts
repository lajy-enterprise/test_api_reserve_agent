// import { z } from "zod";

// // Definimos un objeto de usuario con una propiedad username de tipo string
// const User = z.object({
//   username: z.string(),
// });

// // Bloque para comprobar y manejar errores
// try {
//   const userValidate = User.parse({ username: "Mariano" });

//   console.log("User is valid: " + JSON.stringify(userValidate));
// } catch (error) {
//   if (error instanceof z.ZodError) {
//     console.error(error.errors);
//   }
// }

// // Extraemos el tipo inferido de User
// type User = z.infer<typeof User>;

// const userTipado: User = { username: "Mariano" };
// const userTipadoConError: User = { username: 123 };
