const schema = require("../../schemas/currencySchema");
const discord = require("discord.js");
const ms = require("ms");

/**
 * @param {discord.Client} client
 * @param {discord.Message} message
 * @param {String[]} args
 */

module.exports.run = async (client, message, args) => {
  let user = message.author;
  let amount = Math.floor(Math.random() * 1000) + 100;
  let locations = [
    "car",
    "bike",
    "wallet",
    "pocket",
    "dog",
    "discord",
    "computer",
    "keyboard",
    "laptop",
    "desk",
  ];
  let location = locations[Math.floor(Math.random() * locations.length)];

  let data;
  try {
    data = await schema.findOne({
      userId: user.id,
    });

    if (!data) {
      data = await schema.create({
        userId: user.id,
      });
    }
  } catch (err) {
    console.log(err);
    message.reply({
      content: "An error occurred while running this command.",
    });
  }

  let timeout = 30000;

  if (timeout - (Date.now() - data.searchTimeout) > 0) {
    let timeLeft = ms(timeout - (Date.now() - data.searchTimeout));

    const timeoutEmbed = new discord.MessageEmbed()
      .setColor("#0155b6")
      .setTitle("Chill, Take a breath")
      .setDescription(
        `You are on cooldown, you can use this command again after :alarm_clock: **${timeLeft}**`
      )
      .setTimestamp();

    message.reply({
      embeds: [timeoutEmbed],
    });
  } else {
    data.searchTimeout = Date.now();
    data.wallet += amount * 1;
    await data.save();

    const searchEmbed = new discord.MessageEmbed()
      .setColor("#0155b6")
      .setDescription(
        `You searched a **${location}** and found **:coin: ${amount.toLocaleString()}**`
      )
      .addField("Your Wallet Balance", `${data.wallet.toLocaleString()}`);

    message.reply({
      embeds: [searchEmbed],
    });
  }
};

module.exports.config = {
  name: "search",
  aliases: ["find"],
};
