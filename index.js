const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const config = require("./config.json");

let dumpChannel = null;

client.on("ready", async () => {
	dumpChannel = await client.channels.fetch(config.dumpChannel);
	console.log(`Dumping deleted messages ${config.guildId} in #${dumpChannel.name}`);
});

client.on("messageDelete", async (message) => {
	if (dumpChannel === null) return;
	if (message.channel.type === "dm") return;
	if (message.author.bot) return;
	if (config.guildId !== message.guildId) return;
	
    console.log(message);
	let content = message.content;
	let author = message.author.username;
	let channel = message.channel.name;

    const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: "MESSAGE_DELETE",
	});
	const deletionLog = fetchedLogs.entries.first();

    let deleted_by = "UNKNOWN";

    if (deletionLog && deletionLog.target.id == message.author.id) {
        deleted_by = deletionLog.executor.tag;
    }

	const embed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`${author} in #${channel}`)
		.setDescription(content)
        .addFields({ name: 'Deleted by', value: deleted_by, inline: false })
		.setTimestamp()
		.setFooter({ text: 'EpiLog' });

	dumpChannel.send({ embeds: [embed] });
});

client.login(config.token);
