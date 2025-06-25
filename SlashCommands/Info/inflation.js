const { MessageEmbed } = require("discord.js");
const request = require("request");
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';

module.exports = {
  name: "inflation",
  description: "Get current inflation percentages for any country of your choice",
  options: [
    {
      name: "country",
      description: "The country for which you want inflation data",
      type: "STRING",
      required: true,
    },
    {
      name: "type",
      description: "The inflation indicator type (CPI or HICP)",
      type: "STRING",
      required: true,
      choices: [
        { name: "CPI", value: "CPI" },
        { name: "HICP", value: "HICP" },
        ],
    },
  ],
  run: async (client, interaction) => {
    try {
      const country = interaction.options.getString("country");
      const type = interaction.options.getString("type") || "CPI";
      const apiUrl = `https://api.api-ninjas.com/v1/inflation?type=${type}&country=${encodeURIComponent(country || "")}`;

      const headers = {
        'X-Api-Key': apiKey,
      };

      request.get({
        url: apiUrl,
        headers: headers,
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('Request failed:', error || response.statusCode);
          interaction.reply('Oops! Something went wrong while fetching the inflation data.');
        } else {
          const inflationData = JSON.parse(body);

          if (Array.isArray(inflationData) && inflationData.length > 0) {
            const inflation = inflationData[0];

            const embed = new MessageEmbed()
              .setColor('RANDOM')
              .setTitle(`Inflation Data for ${inflation.country}`)
              .setDescription(`Type: ${inflation.type}\nPeriod: ${inflation.period}`)
              .addField('Monthly Rate (%)', inflation.monthly_rate_pct.toFixed(2), true)
              .addField('Yearly Rate (%)', inflation.yearly_rate_pct.toFixed(2), true);

            interaction.reply({ embeds: [embed] });
          } else {
            interaction.reply(`No inflation data found for ${country || 'the provided country'}.`);
          }
        }
      });
    } catch (error) {
      console.error('Error fetching inflation data:', error);
      interaction.reply('Oops! Something went wrong while fetching the inflation data.');
    }
  },
};
