import 'dotenv/config';
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/node-postgres';
import { phonesTable, phonesInsert, empresasTable, empresasInsert } from './db/schema';
import * as schema from './db/schema';
import { or, like, eq} from "drizzle-orm";

// ------------------ Configuración DB ------------------
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "tu_password",
  database: process.env.DB_NAME || "mi_base",
});

export const db = drizzle(pool, { schema });


// ------------------ Inicializar Express ------------------
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", __dirname + "/../views");

// ------------------ Rutas ------------------

// Ruta principal - Mostrar todos los teléfonos
app.get("/", async (req: Request, res: Response) => {
  const phones = await db.select().from(phonesTable);
  res.render("index", { phones });
});

// Endpoint para agregar teléfono
app.post("/api/phones", async (req: Request, res: Response) => {
  const { name, price, stock, empresa } = req.body;

  try {
    const result = await db.insert(phonesTable).values({
      name,
      price: Number(price),
      stock: Number(stock),
      empresa
    }).returning();

    res.json({ success: true, phone: result[0] }); // devolvemos el ID y datos del nuevo teléfono
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error guardando en la BDD" });
  }
});

// Endpoint para obtener empresas
app.get("/api/empresas", async (req: Request, res: Response) => {
  try {
    const empresas = await db.select().from(empresasTable);
    res.json(empresas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo empresas" });
  }
});

// Endpoint para eliminar teléfono

app.delete("/api/phones/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.delete(phonesTable).where(eq(phonesTable.id, Number(id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error eliminando teléfono" });
  }
})

// Endpoint para buscar teléfonos
app.get("/api/phones/search", async (req: Request, res: Response) => {
  const { q } = req.query;

  try {
    let results;
    if (!q || typeof q !== "string" || q.trim() === "") {
      results = await db.select().from(phonesTable); // todos
    } else {
      results = await db
        .select()
        .from(phonesTable)
        .where(
          or(
            like(phonesTable.name, `%${q}%`),
            like(phonesTable.empresa, `%${q}%`)
          )
        );
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error buscando teléfonos" });
  }
});


async function seedDB() {
  const countPhones = await db.select().from(phonesTable).limit(1);
  if (countPhones.length === 0) {
    const newPhones: phonesInsert[] = [
      { name: 'Samsung Galaxy S23', price: 950, stock: 12, empresa: 'Samsung' },
      { name: 'iPhone 14 Pro', price: 1200, stock: 8, empresa: 'Apple' },
      { name: 'Xiaomi Redmi Note 12', price: 350, stock: 20, empresa: 'Xiaomi' },
      { name: 'Motorola Edge 30', price: 480, stock: 15, empresa: 'Motorola' },
      { name: 'Google Pixel 7', price: 780, stock: 10, empresa: 'Google' },
      { name: 'OnePlus 11', price: 820, stock: 9, empresa: 'OnePlus' },
      { name: 'Nokia G50', price: 310, stock: 25, empresa: 'Nokia' },
      { name: 'Huawei P50 Pro', price: 890, stock: 7, empresa: 'Huawei' },
      { name: 'Sony Xperia 5 IV', price: 1050, stock: 5, empresa: 'Sony' },
      { name: 'Realme GT Neo 3', price: 420, stock: 18, empresa: 'Realme' },
      { name: 'Oppo Reno 8', price: 530, stock: 14, empresa: 'Oppo' },
      { name: 'Samsung Galaxy A54', price: 410, stock: 22, empresa: 'Samsung' },
      { name: 'iPhone 13', price: 980, stock: 11, empresa: 'Apple' },
      { name: 'Xiaomi Poco F4', price: 390, stock: 19, empresa: 'Xiaomi' },
      { name: 'Motorola Moto G82', price: 360, stock: 16, empresa: 'Motorola' },
    ];
    await db.insert(phonesTable).values(newPhones);
  }

  // Seed de empresas
  const countEmpresas = await db.select().from(empresasTable).limit(1);
  if (countEmpresas.length === 0) {
    const newEmpresas: empresasInsert[] = [
      { name: 'Samsung' },
      { name: 'Apple' },
      { name: 'Xiaomi' },
      { name: 'Motorola' },
      { name: 'Google' },
      { name: 'OnePlus' },
      { name: 'Nokia' },
      { name: 'Huawei' },
      { name: 'Sony' },
      { name: 'Realme' },
      { name: 'Oppo' },
      { name: 'Sin empresa' },
    ];
    await db.insert(empresasTable).values(newEmpresas);
  }
}

// ------------------ Iniciar servidor ------------------
seedDB().then(() => {
  console.log("DB inicializada con datos de ejemplo");
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}).catch(console.error);
