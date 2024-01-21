import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Define the Notion API base URL
    const notionApiBaseUrl = "https://api.notion.com";

    // Extract path from the request URL
    const path = request.url?.replace(/^\/api\/notion-api/, "");

    // Make a request to the Notion API
    const axiosResponse = await axios.post(`${notionApiBaseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VITE_NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(request.body),
    });

    // Extract relevant data from the Notion API response
    const data = axiosResponse.data;

    // Return the data in the response
    return response.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    return response.status(502).json({ error: "Bad Gateway" });
  }
}
