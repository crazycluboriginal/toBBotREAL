const { MessageEmbed } = require("discord.js");
const request = require("request");
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';
const Discord = module.require("discord.js");
module.exports = {
  name: "rhyme",
  description: "Find rhyming words for a given word",
  options: [
    {
      name: "word",
      description: "The word to find rhymes for",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const wordQuery = interaction.options.getString("word");
      const apiUrl = `https://api.api-ninjas.com/v1/rhyme?word=${encodeURIComponent(wordQuery)}`;

      const headers = {
        'X-Api-Key': apiKey,
      };

      request.get({
        url: apiUrl,
        headers: headers,
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('Request failed:', error || response.statusCode);
          interaction.reply('Oops! Something went wrong while fetching the rhyming words.');
        } else {
          const rhymingWords = JSON.parse(body);

          if (Array.isArray(rhymingWords) && rhymingWords.length > 0) {
            const embed = new MessageEmbed()
              .setColor('RANDOM')
              .setTitle(`Rhyming Words for "${wordQuery}"`)
              .setDescription(rhymingWords.join('\n'));

            interaction.reply({ embeds: [embed] });
          } else {
            interaction.reply(`No rhyming words found for "${wordQuery}".`);
          }
        }
      });
    } catch (error) {
      console.error('Error fetching rhyming words:', error);
      interaction.reply('Oops! Something went wrong while fetching the rhyming words.');
    }
  },
};
