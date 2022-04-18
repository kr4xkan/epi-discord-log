const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const config = require("./config.json");

let dumpChannel = null;

client.on("ready", async () => {
	dumpChannel = await client.channels.fetch(config.dumpChannel);
	console.log(`Dumping deleted messages ${config.guildId} in #${dumpChannel.name}`);
});

client.on("messageDelete", (message) => {
	if (dumpChannel === null) return;
	if (message.channel.type === "dm") return;
	if (message.author.bot) return;
	if (config.guildId !== message.guildId) return;
	
	let content = message.content;
	let author = message.author.username;
	let channel = message.channel.name;

	const embed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`Message from ${author} in #${channel} deleted`)
		.setDescription(content)
		.setTimestamp()
		.setFooter({ text: 'EpiLog' });

	dumpChannel.send({ embeds: [embed] });
});

client.login(config.token);
