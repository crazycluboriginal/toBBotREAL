const { MessageEmbed } = require("discord.js");
const request = require("request");
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';

module.exports = {
  name: "history",
  description: "Fetch a historical event based on a text query",
  options: [
    {
      name: "event",
      description: "Enter the historical event you want to search for",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const textQuery = interaction.options.getString("event");
      const apiUrl = `https://api.api-ninjas.com/v1/historicalevents?text=${encodeURIComponent(textQuery)}`;

      const headers = {
        'X-Api-Key': apiKey,
      };

      request.get({
        url: apiUrl,
        headers: headers,
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('Request failed:', error || response.statusCode);
          interaction.reply('Oops! Something went wrong while fetching the historical event.');
        } else {
          const eventData = JSON.parse(body);
          if (eventData.length > 0) {
            const event = eventData[0];
            const embed = new MessageEmbed()
              .setColor('RANDOM')
              .setTitle('Historical Event')
              .addField('Date', `${event.day}/${event.month}/${event.year}`)
              .addField('Event', event.event);
            interaction.reply({ embeds: [embed] });
          } else {
            interaction.reply('No historical events found.');
          }
        }
      });
    } catch (error) {
      console.error('Error fetching historical event:', error);
      interaction.reply('Oops! Something went wrong while fetching the historical event.');
    }
  },
};
