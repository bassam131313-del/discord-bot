import. {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  Events
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// حط توكن البوت هنا لاحقًا
const TOKEN = process.env.TOKEN;


const prefix = "-";

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "قوانين") {
    return message.reply("📜 قوانين السيرفر: احترام الجميع، منع السب، منع التخريب.");
  }

  if (command === "تحذير") {
    const member = message.mentions.members.first();
    if (!member) return message.reply("منشن العضو.");
    return message.channel.send(`⚠️ ${member} تم تحذيرك.`);
  }

  if (command === "باند") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("ليس لديك صلاحية.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("منشن العضو.");

    await member.ban();
    message.channel.send(`🔨 تم باند ${member.user.tag}`);
  }

  if (command === "قفل") {
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });
    message.channel.send("🔒 تم قفل الروم.");
  }

  if (command === "فتح") {
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: true,
    });
    message.channel.send("🔓 تم فتح الروم.");
  }
});

client.login(TOKEN);
