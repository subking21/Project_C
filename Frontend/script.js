document.getElementById("getStats").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  const playerTag = document.getElementById("playerTag").value.trim();
  const output = document.getElementById("output");

  if (!apiKey || !playerTag) {
    output.innerHTML = "<p style='color: red;'>Please enter both your API Key and Player Tag.</p>";
    return;
  }

  output.innerHTML = "<p>Fetching data...</p>";

  try {
    const response = await fetch("/api/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, playerTag }),
    });

    const data = await response.json();

    if (!response.ok) {
      output.innerHTML = `<p style='color: red;'>Error: ${data.message || data.error}</p>`;
      return;
    }

    const player = data.player;
    const battles = data.battles;
    const topLostCards = data.topLostCards;

    // Player Info
    let html = `
      <h2>${player.name} (#${player.tag})</h2>
      <p><strong>Trophies:</strong> ${player.trophies}</p>
      <p><strong>Arena:</strong> ${player.arena?.name || "Unknown"}</p>
      <p><strong>Clan:</strong> ${player.clan ? player.clan.name : "No clan"}</p>
      <hr>
      <h3>Last 15 Battles</h3>
    `;

    // Battle List
    battles.forEach((battle, index) => {
      const playerTeam = battle.team?.[0];
      const opponent = battle.opponent?.[0];

      if (!playerTeam || !opponent) return;

      const playerCrowns = playerTeam.crowns ?? 0;
      const opponentCrowns = opponent.crowns ?? 0;
      const isWin = playerCrowns > opponentCrowns;
      const resultText = isWin ? "VICTORY" : playerCrowns < opponentCrowns ? "LOSS" : "DRAW";
      const resultClass = isWin ? "win" : playerCrowns < opponentCrowns ? "loss" : "draw";

      html += `
        <div class="battle ${resultClass}">
          <div class="battle-result ${resultClass}-banner">${resultText}</div>
          <div class="battle-body">
            <div class="battle-row">
              <span class="player-name">YOU</span>
              <div class="cards">
                ${playerTeam.cards.map(c => `<div class="card"><img src="${c.iconUrls.medium}" title="${c.name}"></div>`).join("")}
              </div>
              <span class="crowns">👑 ${playerCrowns}</span>
            </div>
            <div class="battle-row">
              <span class="player-name">${opponent.name}</span>
              <div class="cards">
                ${opponent.cards.map(c => `<div class="card"><img src="${c.iconUrls.medium}" title="${c.name}"></div>`).join("")}
              </div>
              <span class="crowns">👑 ${opponentCrowns}</span>
            </div>
          </div>
        </div>
      `;
    });

    // Top Lost Cards
    html += `
      <hr>
      <h3>Top 8 Cards You Lost To Most</h3>
      <div class="lost-cards">
        ${topLostCards.length
          ? topLostCards.map(c => `<p>${c.name}: ${c.count} times</p>`).join("")
          : "<p>No losses recorded in last 15 games.</p>"}
      </div>
    `;

    output.innerHTML = html;
  } catch (err) {
    console.error(err);
    output.innerHTML = `<p style='color: red;'>Error fetching data: ${err.message}</p>`;
  }
});
