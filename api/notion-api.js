const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());

app.all("/notion-api/*", async (req, res) => {
  try {
    const apiEndpoint = "https://api.notion.com";
    const path = req.params[0];
    const url = `${apiEndpoint}/${path}`;

    console.log(`API endpoint: ${url}`);

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        // Add any required headers for authentication or other purposes
        Authorization: "Bearer " + import.meta.env.VITE_NOTION_API_KEY,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    // Set the response headers to match the original response
    res.set(response.headers);

    // Forward the status code and data from the Notion API response
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
