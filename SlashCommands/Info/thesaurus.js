const { MessageEmbed } = require("discord.js");
const request = require("request");
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';

module.exports = {
  name: "thesaurus",
  description: "Find synonyms and antonyms for any word of your choice!",
  options: [
    {
      name: "word",
      description: "The word to find synonyms and antonyms for",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const word = interaction.options.getString("word");
      const apiUrl = `https://api.api-ninjas.com/v1/thesaurus?word=${encodeURIComponent(word)}`;

      const headers = {
        'X-Api-Key': apiKey,
      };

      request.get({
        url: apiUrl,
        headers: headers,
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('Request failed:', error || response.statusCode);
          interaction.reply('Oops! Something went wrong while fetching synonyms and antonyms.');
        } else {
          const thesaurusData = JSON.parse(body);

          const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Synonyms and Antonyms for "${word}"`)
            .addField('Synonyms', thesaurusData.synonyms.join(', '))
            .addField('Antonyms', thesaurusData.antonyms.join(', '));

          interaction.reply({ embeds: [embed] });
        }
      });
    } catch (error) {
      console.error('Error fetching synonyms and antonyms:', error);
      interaction.reply('Oops! Something went wrong while fetching synonyms and antonyms.');
    }
  },
};
