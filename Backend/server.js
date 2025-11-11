const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../Frontend")));

app.post("/api/player", async (req, res) => {
  const { apiKey, playerTag } = req.body;

  if (!apiKey || !playerTag) {
    return res.status(400).json({ error: "Missing API key or player tag" });
  }

  const cleanTag = playerTag.replace("#", "").trim();

  try {
    // Fetch player info
    const playerRes = await axios.get(`https://api.clashroyale.com/v1/players/%23${cleanTag}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Fetch battle log
    const battlesRes = await axios.get(`https://api.clashroyale.com/v1/players/%23${cleanTag}/battlelog`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Include all normal 1v1-like battles (not 2v2 or boat)
    const validBattles = battlesRes.data
      .filter(b => b.team?.[0] && b.opponent?.[0] && b.team.length === 1 && b.opponent.length === 1)
      .sort((a, b) => new Date(b.battleTime) - new Date(a.battleTime))
      .slice(0, 15);

    const lostCardCounts = {};

    validBattles.forEach((battle, index) => {
      const player = battle.team[0];
      const opponent = battle.opponent[0];

      if (!player?.cards || !opponent?.cards) {
        console.log(`⚠️ Skipping battle ${index + 1} — missing card data`);
        return;
      }

      const playerCrowns = player.crowns ?? 0;
      const opponentCrowns = opponent.crowns ?? 0;

      // Improved loss detection
      const playerLost =
        (typeof playerCrowns === "number" &&
          typeof opponentCrowns === "number" &&
          opponentCrowns > playerCrowns) ||
        battle.team[0].battleResult === "defeat";

      if (playerLost) {
        opponent.cards.forEach(card => {
          if (card?.name) {
            lostCardCounts[card.name] = (lostCardCounts[card.name] || 0) + 1;
          }
        });
      }
    });

    const topLostCards = Object.entries(lostCardCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    res.json({
      player: playerRes.data,
      battles: validBattles,
      topLostCards,
    });
  } catch (err) {
    if (err.response) {
      console.error("API Error:", err.response.status, err.response.data);
      res.status(err.response.status).json(err.response.data);
    } else {
      console.error("Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
