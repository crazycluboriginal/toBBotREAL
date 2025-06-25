const { MessageEmbed } = require("discord.js");
const weather = require("openweather-apis");
const Discord = module.require("discord.js");

module.exports = {
  name: "forecast",
  description: "Get a 5-day weather forecast for any city",
  options: [
    {
      name: "city",
      description: "The name of the city of your choice",
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

      weather.getWeatherForecast(function(err, JSONObj) {
        if (err) {
          interaction.reply(`${err}`);
        } else {
          const forecast = JSONObj.list.filter((day, index) => index % 8 === 0); 
          const cityFormatted = city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

          const weatherEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`5-Day Weather Forecast for ${cityFormatted}`)
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/4052/4052984.png')
            .setTimestamp();

          forecast.forEach((day) => {
            const date = new Date(day.dt * 1000);
            const tempHigh = day.main.temp_max;
            const tempLow = day.main.temp_min;
            const sky = day.weather[0].description;

            const emojiMap = {
              rain: '🌧️',
              cloud: '☁️',
              snow: '🌨️',
              thunder: '⛈️',
              few: '🌤️',
              broken: '⛅️',
              scattered: '🌤️',
              mist: '🌫️',
              fog: '🌫️',
            };

            let emoji = '☀️';
            for (const [condition, emojiCode] of Object.entries(emojiMap)) {
              if (sky.includes(condition)) {
                emoji = emojiCode;
                break;
              }
            }

            const temperature = Math.abs(tempHigh - tempLow) > 0.5 ? `${tempHigh.toFixed(1)}°C / ${tempLow.toFixed(1)}°C` : `${tempHigh.toFixed(1)}°C`;


            weatherEmbed.addField(
              `${date.toDateString()}`,
              `${emoji} ${temperature}\n**${sky}**`,
              true
            );
          });

          interaction.reply({ embeds: [weatherEmbed] });
        }
      });
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      interaction.reply('Oops! Something went wrong while fetching the weather forecast.');
    }
  },
};
