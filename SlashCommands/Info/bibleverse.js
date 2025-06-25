const { MessageEmbed } = require("discord.js");
const he = require("he");
const Discord = module.require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "bibleverse",
  description: "Get the Bible verse of the day",
  run: async (client, interaction) => {
    try {
      const response = await fetch("https://www.biblegateway.com/votd/get/?format=json");
      if (!response.ok) {
        throw new Error(`Failed to fetch Bible verse, status ${response.status}`);
      }
      const data = await response.json();
      const verse = he.decode(data.votd.text.replace(/(<([^>]+)>)/gi, ""));
      const reference = data.votd.reference;

      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle("Bible Verse of the Day")
        .setDescription(verse)
        .setFooter(reference);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("An error occurred:", error);
      interaction.reply("Oops! Something went wrong while fetching the Bible verse.");
    }
  },
};
