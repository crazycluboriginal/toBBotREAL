const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const Discord = module.require("discord.js");

module.exports = {
  name: "joke",
  description: "Sends a random joke",
  run: async (client, interaction) => {
    try {
      const response = await fetch('https://sv443.net/jokeapi/v2/joke/Any');
      const joke = await response.json();

      let jokeText = '';
      if (joke.type === 'single') {
        jokeText = joke.joke;
      } else if (joke.type === 'twopart') {
        jokeText = `${joke.setup}\n${joke.delivery}`;
      }

      const embed = new MessageEmbed()
        .setColor('#ff9900')
        .setTitle('Random Joke')
        .setDescription(jokeText)
        .setFooter('🤣😅😆😂');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching joke:', error);
      interaction.reply('Oops! Something went wrong while fetching the joke.');
    }
  },
};
