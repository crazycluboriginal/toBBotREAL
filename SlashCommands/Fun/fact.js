const fetch = require("node-fetch");
const {MessageEmbed, Message} = require("discord.js");
const { stringify } = require("querystring");
const Discord = module.require("discord.js");

module.exports = {
  name: "fact",
  description: "Use this command and generate random knowledge!",
  run: async (client, interaction) => {
    try {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json');
    const factData = await response.json();

    const factEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Random Fact:')
      .setDescription(`> ${factData.text}`)
      .setTimestamp();

await interaction.reply({ embeds: [factEmbed]})
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
