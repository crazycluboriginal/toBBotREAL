const axios = require("axios");
const {MessageEmbed} = require("discord.js");
const Discord = module.require("discord.js");


module.exports = {
  name: "advice",
  description: "Stuck? Use this command to get some general advice in life.",
  run: async (client, interaction) => {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      const advice = response.data.slip.advice;
      const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Useful Life Advice')
        .setDescription(advice)
        .setTimestamp();
await interaction.reply({ embeds: [embed]})
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
    