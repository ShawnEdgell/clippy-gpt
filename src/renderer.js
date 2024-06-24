const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY; // Use the API key from .env

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sendButton").addEventListener("click", sendMessage);
  document.getElementById("input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});

async function sendMessage() {
  const input = document.getElementById("input");
  const message = input.value;

  if (message.trim() === "") return;

  // Clear input field immediately
  input.value = "";

  // Display user message
  addMessage("Me", message);

  // Call ChatGPT API
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const botMessage = response.data.choices[0].message.content.trim();
    addMessage("ChatGPT", botMessage);
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    addMessage("ChatGPT", "Error calling ChatGPT API.");
  }
}

function addMessage(sender, text) {
  const messages = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender.toLowerCase()} p-2 mb-2 rounded-lg`;
  messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}
