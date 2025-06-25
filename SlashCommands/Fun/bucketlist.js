const { MessageEmbed } = require("discord.js");
const request = require("request");
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';

module.exports = {
  name: "bucketlist",
  description: "Get a random bucket list item",
  options: [],

  run: async (client, interaction) => {
    // defer to give us time to fetch
    await interaction.deferReply();

    const apiUrl = "https://api.api-ninjas.com/v1/bucketlist";
    const headers = { "X-Api-Key": apiKey };

    request.get({ url: apiUrl, headers }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error("Error fetching bucket list item:", error || response.statusCode, body);
        return interaction.editReply("Oops! Something went wrong while fetching the bucket list item.");
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        console.error("Failed to parse API response:", e);
        return interaction.editReply("Received invalid data from the bucket list API.");
      }

      const item = data.item;
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("🎯 Bucket List Item")
        .setDescription(item);

      interaction.editReply({ embeds: [embed] });
    });
  },
};
