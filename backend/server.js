// server.js
import express from "express";
import cors from "cors";
import mandiPricesRoute from "./routes/mandiPrices.js";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use("/api/mandi-prices", mandiPricesRoute);

app.get("/", (req, res) => res.send("Kisaan Mitra Backend Running ✅"));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
