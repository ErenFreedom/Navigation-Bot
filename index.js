// ✅ Load .env variables from .env file
require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const http = require("http");

// ✅ Load env vars
const token = process.env.DISCORD_TOKEN || '';
const clientId = process.env.CLIENT_ID || '';
const guildId = process.env.GUILD_ID || '';
const PORT = process.env.PORT || 7000;

// ✅ Fail-fast if missing
if (!token || !clientId || !guildId) {
    console.error("❌ One or more environment variables are missing:");
    console.error("DISCORD_TOKEN:", token ? "✅ Present" : "❌ Missing");
    console.error("CLIENT_ID:", clientId ? "✅ Present" : "❌ Missing");
    console.error("GUILD_ID:", guildId ? "✅ Present" : "❌ Missing");
    process.exit(1);
}

// ✅ Initialize Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
    console.log("✅ Bot is ready!");
});

// ✅ Command handlers
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "help") {
        await interaction.reply({
            content:
                "Here are the available commands:\n/help - List all commands\n/navigation - Get navigation help\n/morecommands - List more commands",
            ephemeral: true,
        });
    } else if (commandName === "navigation") {
        await interaction.reply({
            content:
                "Navigation help:\n1. Use the channels on the left to navigate.\n2. Use @mentions to get attention.\n3. Check pinned messages for important info.",
            ephemeral: true,
        });
    } else if (commandName === "morecommands") {
        await interaction.reply({
            content:
                "More commands:\n1. /rules - List server rules\n2. /info - Get server info\n3. /contact - Contact server admins",
            ephemeral: true,
        });
    }
});

// ✅ Login the bot
client.login(token);

// ✅ Slash commands
const commands = [
    { name: "help", description: "List all commands" },
    { name: "navigation", description: "Get navigation help" },
    { name: "morecommands", description: "List more commands" },
];

// ✅ Register slash commands
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
    try {
        console.log("🌐 Started refreshing application (/) commands...");

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log("✅ Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error("❌ Error refreshing commands:", error);
    }
})();

// ✅ Simple keep-alive server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
});

server.listen(PORT, () => {
    console.log(`🌐 HTTP server listening on port ${PORT}`);
});
