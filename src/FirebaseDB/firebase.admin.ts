import { initializeApp, cert } from "firebase-admin/app";
// import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

import fs from "fs";
import * as path from "path";

const filePath = path.join(
  __dirname,
  "agentar-da00f-firebase-adminsdk-75npg-a1016f6b4d.json"
);

const jsonFile = fs.readFileSync(filePath, "utf-8");
const serviceAccount = JSON.parse(jsonFile);

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const firestoreDB = getFirestore(app);

// const app = initializeApp();
