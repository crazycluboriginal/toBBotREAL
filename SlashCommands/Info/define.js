const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "define",
  description: "Get the definition of a word",
  options: [
    {
      name: "word",
      description: "The word to define",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const word = interaction.options.getString("word");
      const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=c77d705d-1d6f-4d29-a823-21dcc5c5940e`);
      const data = await response.json();

      if (data.length === 0) {
        interaction.reply(`Sorry, I couldn't find a definition for the word "${word}".`);
      } else {
        const definition = data[0].shortdef ? String(data[0].shortdef[0]) : 'N/A';
        const example = data[0].def && data[0].def[0].sseq && data[0].def[0].sseq[0][0] && data[0].def[0].sseq[0][0][1] && data[0].def[0].sseq[0][0][1].dt && data[0].def[0].sseq[0][0][1].dt[1] ? String(data[0].def[0].sseq[0][0][1].dt[1][1]) : 'N/A';
        const synonyms = data[0].meta && data[0].meta.syns && data[0].meta.syns.length > 0 ? data[0].meta.syns[0].map(synonym => String(synonym)).join(', ') : 'N/A';

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(word)
          .setDescription(definition)
          .addField('Example', example)
          .addField('Synonyms', synonyms);

        interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      interaction.reply(`Sorry, there was an error retrieving the definition for "${word}".`);
    }
  },
};
