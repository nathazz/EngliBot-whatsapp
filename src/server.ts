import "dotenv/config";
import express from "express";
// import { clientWhatsApp } from "./client/client";

const app = express();
const PORT = process.env.PORT || 3000;


// clientWhatsApp();
app.listen(PORT, () => console.log(`Running!`));
