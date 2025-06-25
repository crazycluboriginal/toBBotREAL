const axios = require("axios");
const {MessageEmbed} = require("discord.js");
const Discord = module.require("discord.js");


module.exports = {
  name: "quote",
  description: "Sends a random quote for motivation!",
  run: async (client, interaction) => {
    try {
      const response = await axios.get('https://zenquotes.io/api/random');
      const quote = response.data[0].q;
      const author = response.data[0].a;

      let embed = new MessageEmbed()
        .setTitle(`Inspirational Quote`)
        .setColor('RANDOM')
        .setDescription(`"${quote}"`)
        .setFooter(`- ${author}`);

await interaction.reply({ embeds: [embed]})
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
