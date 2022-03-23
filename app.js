const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const InitilizeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
InitilizeDbAndServer();
//get all players in cricket team apl//
app.get("/players/", async (request, response) => {
  const addPlayersQuery = `
    SELECT * FROM cricket_team
    ORDER BY player_id`;
  const playersArray = await db.all(addPlayersQuery);
  response.send(playersArray);
});
//post player apl//
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playerDetails;
  const postBookQuery = `
      INSERT INTO cricket_team(playerId,playerName,jerseyNumber,role)
      VALUES(
          '${playerId}',
           ${playerName},
          '${jerseyNumber}',
           ${role}
      );`;
  await db.run(postBookQuery);
  response.send("Player Added to Team");
});
//get one player API//
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getBookQuery = `
    SELECT*FROM cricket_team
    WHERE 
    playerId= ${playerId}`;
  const player = await db.get(getBookQuery);
  response.send(player);
});
//update player in API
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayerDetails = request.body;
  const { playerName, jerseyNumber, role } = updatePlayerDetails;
  const updateplayer = `
    UPDATE cricket_team
    SET playerId='${playerId}',
        playerName=${playerName},
        jerseyNumber='${jerseyNumber}',
        role=${role}
    WHERE playerId=${playerId}
    `;
  await db.run(updateplayer);
  response.send("Player Details Updated");
});
//delete player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteplayerQuery = `
  DELETE FORM cricket_team
  WHERE playerId=${playerId}`;
  await db.run(deleteplayerQuery);
  response.send("Player Removed");
});

module.exports = app;
