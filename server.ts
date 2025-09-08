import express from "express";
import { db } from "./src/index";
import { phonesTable } from "./src/db/schema";
import { Request, Response } from "express";
import { empresasTable } from "./src/db/schema";

const app = express();
app.use(express.json());

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", "./views");

// Ruta principal que consulta la DB
app.get("/", async (_req, res) => {
  try {
    const result = await db.select().from(phonesTable);
    res.render("index", { Phones: result });
  } catch (err) {
    res.status(500).send("Error consultando la base de datos");
  }
});

// Endpoint para obtener empresas
app.get("/api/empresas", async (req: Request, res: Response) => {
  try {
    const empresas = await db.select().from(empresasTable);
    res.json(empresas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener empresas" });
  }
});

// Endpoint para agregar teléfono
app.post("/api/phones", async (req, res) => {
  const { name, price, stock, empresa } = req.body;
  try {
    const result = await db.insert(phonesTable).values({ name, price, stock, empresa });
    res.json({ success: true, phone: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error guardando en la DB" });
  }
});

app.listen(3000, () => {
  console.log("");
});