import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.all("/notion-api/*", async (req, res) => {
  try {
    const apiEndpoint = "https://api.notion.com";
    const path = req.params[0];
    const url = `${apiEndpoint}/${path}`;

    console.log("Constructed URL:", url);

    const response = await axios({
      method: req.method,
      url,
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
        Authorization: `Bearer ${process.env.VITE_NOTION_API_KEY}`,
      },
      data: req.method !== "GET" ? req.body : undefined,
    });

    // Set the response headers to match the original response
    res.set(response.headers);

    // Forward the status code and data from the Notion API response
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(502).json({ error: "Bad Gateway" });
  }
});

// app.listen("3000", () => {
//   console.log(`Server is running on port 3000`);
// });

export default app;
