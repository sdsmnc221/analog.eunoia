// api/notion-api.js
require("dotenv").config();
const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const apiEndpoint = "https://api.notion.com";
    const path = req.url.replace(/^\/notion-api\//, "");
    const url = `${apiEndpoint}/${path}`;

    const response = await axios({
      method: req.method,
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VITE_NOTION_API_KEY}`,
      },
      data: req.method !== "GET" ? req.body : undefined,
    });

    // Set the response headers to match the original response
    res.setHeader("Content-Type", "application/json");
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(502).json({ error: "Bad Gateway" });
  }
};
