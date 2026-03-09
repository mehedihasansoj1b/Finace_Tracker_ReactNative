import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimit from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

//middleware

app.use(rateLimit);
app.use(express.json());

// our custom simple middleware
// console.log ("Hey we hit a req", the method is", req.method);
// next();
// });

const PORT = process.env.PORT || 5006;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(255) NOT NULL,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
)`;

    // DECIMA(10,2)
    // means: a fixed-point number with:
    // 10 digits total
    // 2 digits after the decimal point
    // so: the max value it can store is 99999999.9 (8 digits before the deciman, 2 after)

    console.log("Database initalized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}

app.get("/", (req, res) => {
  res.send("its working");
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT: ", PORT);
  });
});
