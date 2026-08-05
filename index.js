import {
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

const VERIFY_CHANNEL_ID = "1534306655691608135";
const VERIFY_REQUESTS_CHANNEL_ID = "1534306714604667040";
const VERIFY_LOG_CHANNEL_ID = "1534306771382960288";

// بنضيف ID رتبة Verified لاحقًا
const VERIFIED_ROLE_ID = "";

client.once("ready", async () => {
  console.log(`${client.user.tag} is online!`);

  const channel = await client.channels.fetch(VERIFY_CHANNEL_ID).catch(() => null);

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("📋 التفعيل")
    .setDescription("اضغط الزر بالأسفل لبدء التفعيل.")
    .setColor("Blue");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("start_verify")
      .setLabel("ابدأ التفعيل")
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({
    embeds: [embed],
    components: [row],
  });
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
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "start_verify") {
    const modal = new ModalBuilder()
      .setCustomId("verify_modal")
      .setTitle("نموذج التفعيل");

    const name = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("اسمك")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const age = new TextInputBuilder()
      .setCustomId("age")
      .setLabel("عمرك")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const roblox = new TextInputBuilder()
      .setCustomId("roblox")
      .setLabel("يوزرك روبلوكس")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const country = new TextInputBuilder()
      .setCustomId("country")
      .setLabel("من وين؟")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const image = new TextInputBuilder()
      .setCustomId("image")
      .setLabel("رابط صورة حسابك روبلوكس")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(name),
      new ActionRowBuilder().addComponents(age),
      new ActionRowBuilder().addComponents(roblox),
      new ActionRowBuilder().addComponents(country),
      new ActionRowBuilder().addComponents(image)
    );

    await interaction.showModal(modal);
  }});
client.login(TOKEN);
