const fetch = require("node-fetch");
const he = require("he");
const {MessageEmbed} = require("discord.js");
const Discord = module.require("discord.js");


module.exports = {
  name: "randomword",
  description: "Find a completely random word in the dictionary!",
  run: async (client, interaction) => {
  try {
    const response = await fetch(`https://api.wordnik.com/v4/words.json/randomWord?api_key=lcwzt69rcg3xdo3lqm8ew5439zhm89pbtigty4os863b6d2hy`);
    const data = await response.json();
    const word = he.decode(data.word);
    const definitionResponse = await fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=true&api_key=lcwzt69rcg3xdo3lqm8ew5439zhm89pbtigty4os863b6d2hy`);
    const definitionData = await definitionResponse.json();
    const definition = definitionData[0].text.replace(/<\/?xref>/g, '');
    const decodedDefinition = he.decode(definition); // Decode HTML entities in definition text
    const embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(word)
      .setDescription(decodedDefinition);

await interaction.reply({ embeds: [embed]})
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
