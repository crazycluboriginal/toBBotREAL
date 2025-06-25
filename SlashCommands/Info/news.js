const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "news",
  description: "Stay up to date, and read a random news article",
  options: [
    {
      name: "country",
      description: "2-letter country code (e.g. ca, us)",
      type: 3,          // STRING
      required: false,
    },
    {
      name: "category",
      description: "News category",
      type: 3,          // STRING
      required: false,
      choices: [
        { name: "Business",      value: "business" },
        { name: "Entertainment", value: "entertainment" },
        { name: "General",       value: "general" },
        { name: "Health",        value: "health" },
        { name: "Science",       value: "science" },
        { name: "Sports",        value: "sports" },
        { name: "Technology",    value: "technology" },
      ],
    },
    {
      name: "query",
      description: "Keyword search (e.g. bitcoin)",
      type: 3,          // STRING
      required: false,
    },
  ],

  run: async (client, interaction) => {
    const apiKey   = "59002a36970b49bcb9b073878ab360b6";
    const country  = interaction.options.getString("country");
    const category = interaction.options.getString("category");
    const query    = interaction.options.getString("query");

    const params = new URLSearchParams({ apiKey });
    if (country)  params.set("country",  country);
    if (category) params.set("category", category);
    if (query)    params.set("q",        query);
    if (!country && !category && !query) params.set("language", "en");

    try {
      const res  = await fetch(`https://newsapi.org/v2/top-headlines?${params}`);
      const json = await res.json();
      if (!json.articles?.length) {
        return interaction.reply("No articles found for those parameters.");
      }

      const art = json.articles[Math.floor(Math.random() * json.articles.length)];
      const embed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle(art.title)
        .setDescription(art.description || "No description available.")
        .setURL(art.url)
        .setImage(art.urlToImage)
        .setFooter("Powered by NewsAPI");

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.reply("Sorry, something went wrong fetching the news.");
    }
  },
};
