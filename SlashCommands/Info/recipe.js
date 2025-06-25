const { MessageEmbed } = require("discord.js");
const request = require("request");
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';

module.exports = {
  name: "recipe",
  description: "Get recipes for any food of your choice",
  options: [
    {
      name: "query",
      description: "The search query for recipes",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const query = interaction.options.getString("query");
      const apiUrl = `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(query)}`;

      const headers = {
        'X-Api-Key': apiKey,
      };

      request.get({
        url: apiUrl,
        headers: headers,
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('Request failed:', error || response.statusCode);
          interaction.reply('Oops! Something went wrong while fetching the recipes.');
        } else {
          const recipes = JSON.parse(body);

          if (Array.isArray(recipes) && recipes.length > 0) {
            const embed = new MessageEmbed()
              .setColor('RANDOM')
              .setTitle(`Recipes for "${query}"`)
              .setDescription(recipes.map(recipe => `**${recipe.title}**\n${recipe.servings}\n${recipe.instructions}\n`).join('\n'));

            interaction.reply({ embeds: [embed] });
          } else {
            interaction.reply(`No recipes found for "${query}".`);
          }
        }
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      interaction.reply('Oops! Something went wrong while fetching the recipes.');
    }
  },
};
