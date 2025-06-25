const { MessageEmbed } = require("discord.js");
const request = require("request");
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';
const Discord = module.require("discord.js");

module.exports = {
  name: "convertcurrency",
  description: "Convert currency from one type to another",
  options: [
    {
      name: "have",
      description: "Currency you currently hold (3-character currency code)",
      type: "STRING",
      required: true,
    },
    {
      name: "want",
      description: "Currency you want to convert to (3-character currency code)",
      type: "STRING",
      required: true,
    },
    {
      name: "amount",
      description: "Amount of currency to convert",
      type: "NUMBER",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const have = interaction.options.getString("have");
      const want = interaction.options.getString("want");
      const amount = interaction.options.getNumber("amount");

      const apiUrl = `https://api.api-ninjas.com/v1/convertcurrency?have=${have}&want=${want}&amount=${amount}`;

      const headers = {
        'X-Api-Key': apiKey,
      };

      request.get({
        url: apiUrl,
        headers: headers,
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('Request failed:', error || response.statusCode);
          interaction.reply('Oops! Something went wrong while performing the currency conversion.');
        } else {
          const conversionData = JSON.parse(body);

          const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Currency Conversion')
            .addField(`Converted ${have} to ${want}`, `${amount} ${have} = ${conversionData.new_amount.toFixed(2)} ${want}`);

          interaction.reply({ embeds: [embed] });
        }
      });
    } catch (error) {
      console.error('Error performing currency conversion:', error);
      interaction.reply('Oops! Something went wrong while performing the currency conversion.');
    }
  },
};
