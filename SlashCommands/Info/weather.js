const { MessageEmbed } = require("discord.js");
const weather = require("openweather-apis");

module.exports = {
  name: "weather",
  description: "Get current weather information for a city",
  options: [
    {
      name: "city",
      description: "The name of the city you want to get weather info from",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const city = interaction.options.getString("city");

      weather.setAPPID('3c4048f209bab356f911291f74507907');
      weather.setLang('en');
      weather.setUnits('metric');
      weather.setCity(city);

      weather.getAllWeather(function(err, JSONObj) {
        if (err) {
          interaction.reply(`${err}`);
        } else {
          const temp = JSONObj.main.temp;
          let sky = JSONObj.weather[0].description;

          // Capitalize the first letter of each word
          sky = sky.replace(/\b\w/g, (char) => char.toUpperCase());

          const emojiMap = {
            rain: '🌧️',
            cloud: '☁️',
            snow: '🌨️',
            thunder: '⛈️',
            few: '🌤️',
            broken: '⛅️',
            scattered: '⛅️',
            mist: '🌫️',
            fog: '🌫️',
            smoke: '💨',
          };

          let emoji = '☀️';
          for (const [condition, emojiCode] of Object.entries(emojiMap)) {
            if (sky.toLowerCase().includes(condition)) {
              emoji = emojiCode;
              break;
            }
          }

          let cityname = city.replace(/\b\w/g, (char) => char.toUpperCase());

          const weatherEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Weather in ${cityname}`)
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/4052/4052984.png')
            .addFields(
              { name: 'Temperature', value: `${temp}°C`, inline: true },
              { name: 'Conditions', value: `${emoji} ${sky}`, inline: true },
            )
            .setTimestamp();

          interaction.reply({ embeds: [weatherEmbed] }).catch((err) => {
            console.error('Failed to send weather embed:', err);
          });
        }
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      interaction.reply('Oops! Something went wrong while fetching the weather information.');
    }
  },
};