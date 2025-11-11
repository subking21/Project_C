*WORK IN PROGRESS*

NOTE: I'm still working on this project their are still problems with the code

🏆 Clash Royale Battle Log Viewer

A simple web app that lets you view your last 15 Clash Royale games using your own API key from the official Royale API.
It displays both decks side-by-side (you vs opponent), shows whether you won or lost, and highlights the top 8 cards you’ve lost to most.

🚀 Features

View your 15 most recent battles.

See both player and opponent decks with card icons.

Win/Loss indicator for each match.

Displays your Top 8 most common losing cards.

Compact Clash Royale–style layout.

Works entirely in the browser — no API keys are stored.

🧩 Tech Stack

HTML — structure

CSS — styled UI (Clash Royale–inspired)

JavaScript (Frontend) — fetches data and displays results

Node.js + Express (Backend) — handles API requests securely

⚙️ Setup Instructions
1️⃣ Clone this repository
git clone https://github.com/<your-username>/<Project_C>.git
cd <Project_C>

2️⃣ Install dependencies

Make sure you have Node.js installed, then run:

npm install

3️⃣ Start the server
node server.js


By default, the app runs on:

http://localhost:3000

4️⃣ Open the website

Once the server is running, open index.html in your browser.
You can enter your Clash Royale API key and player tag to load your stats.

🔑 API Key Setup

You’ll need an API key from the Clash Royale Developer Portal.
Paste your key into the input box on the webpage — the app never saves it.

🛠️ Development Notes

All main files are in the root directory:

Project/
├── Backend/
│   ├── server.js
│   └── package.json
└── Frontend/
    ├── index.html
    ├── style.css
    └── script.js

📄 License

This project is open-source and available under the MIT License.

💬 Credits

Clash Royale assets & data © Supercell

API powered by RoyaleAPI

Built by [Your Name]