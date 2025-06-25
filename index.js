require("dotenv").config();
process.traceDeprecation = true;

const express = require("express");
const app = express();
const port = 8080;

const BOT_TOKEN = process.env.TOKEN;
const ALEXFLIPNOTE_API_KEY = process.env.ALEXFLIPNOTE_API_KEY;
const YT_COOKIE = process.env.YT_COOKIE;
const ERROR_LOGS_CHANNEL = process.env.ERROR_LOGS_CHANNEL;
const MONGO_URI = process.env.MONGO_URI;

if (!BOT_TOKEN || !MONGO_URI) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: "majority" },
});

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 'majority' },
});

mongoose.connection.once("open", () => console.log("MongoDB connected."));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

app.get("/", (req, res) =>
  res.send(`
    <html>
      <head>
        <title>Server Ping</title>
      </head>
      <body>
        <h1>toBBot Slash Command Directory</h1>
        <p>toBBot is up and running.</p>
        <p>Current time: ${new Date()}</p>
       <a href="/help">Commands list</a> <br>
       <a href="/console">View console</a>
      </body>
    </html>
  `)
);

const consoleLogs = [];
const originalConsoleLog = console.log;
console.log = function (...args) {
  const log = args.join(" ");
  consoleLogs.push(log);
  originalConsoleLog.apply(console, args);
};

app.get("/console", (req, res) => {
  const logsList = consoleLogs.map((log) => `<li>${log}</li>`).join("");
  res.send(`
    <html>
      <head><title>Console Log</title></head>
      <body>
        <h1>Console Log</h1>
        <h2> Commands Status:</h2>
        <ul>${logsList}</ul>
        <a href="/">Back to main page</a>
      </body>
    </html>
  `);
});

app.get("/help", (req, res) => {
  res.send(`<html><head><title>toBBot Help Menu</title></head><body>...help content here...</body></html>`);
});

app.listen(port, () =>
  console.log(`The app is listening at http://localhost:${port}`)
);

const fs = require("fs");
const chalk = require("chalk");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const { DEFAULT_PREFIX } = require("./config.json");
const { loadCommands } = require("./handler/loadCommands");
const { loadEvents } = require("./handler/loadEvents");
const { loadSlashCommands } = require("./handler/loadSlashCommands");
const { loadPlayerEvents } = require("./handler/loadPlayerEvents");
const { DiscordTogether } = require("discord-together");
const { Player } = require("discord-player");
const Enmap = require("enmap");

const client = new Client({
  allowedMentions: { parse: ["users", "roles"] },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

const Embeds = require("./functions/embeds/Embeds");
const Logger = require("./functions/Logger/Logger");
const Util = require("./functions/util/Util");

const alexClient = require("alexflipnote.js");
client.images = new alexClient(ALEXFLIPNOTE_API_KEY);
client.discordTogether = new DiscordTogether(client);
client.commands = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands/");
client.setMaxListeners(0);

client.logger = Logger;
client.utils = Util;
client.say = Embeds;
client.player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: false,
  leaveOnEmpty: false,
  leaveOnEmptyCooldown: 60000,
  autoSelfDeaf: true,
  initialVolume: 130,
  ytdlDownloadOptions: {
    requestOptions: {
      headers: {
        cookie: YT_COOKIE,
      },
    },
  },
});

client.player.use("YOUTUBE_DL", require("@discord-player/downloader").Downloader);
client.db = new Enmap({ name: "musicdb" });

loadCommands(client);
loadEvents(client);
loadPlayerEvents(client);
loadSlashCommands(client);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);
  const embed = new MessageEmbed().setTitle("Uncaught Exception").setDescription(`${err}`).setColor("RED");
  client.channels.cache.get(ERROR_LOGS_CHANNEL)?.send({ embeds: [embed] });
});

client.login(BOT_TOKEN).then(() => {
  console.log(
    chalk.bgBlueBright.black(` Successfully logged in as: ${client.user.username}#${client.user.discriminator} `)
  );
});
