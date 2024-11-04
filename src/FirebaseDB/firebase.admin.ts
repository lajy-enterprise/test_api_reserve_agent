import { initializeApp, cert } from "firebase-admin/app";
// import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

import fs from "fs";
import * as path from "path";

dotenv.config();

// const filePath = path.join(
//   __dirname,
//   "agentar-da00f-firebase-adminsdk-75npg-a1016f6b4d.json"
// );

// const jsonFile = fs.readFileSync(filePath, "utf-8");
// const serviceAccount = JSON.parse(jsonFile);

const app = initializeApp({
  credential: cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
  }),
});

console.log(process.env.PROJECT_ID);
console.log("-----------------");

console.log(process.env.CLIENT_EMAIL);
console.log("-----------------");

console.log(process.env.PRIVATE_KEY);

export const firestoreDB = getFirestore(app);

// const app = initializeApp();
