const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "meme",
  description: "Sends a random meme from Meme API. You can also pick a category (optional)",
  options: [
    {
      name: "category",
      description: "Choose a category for memes (optional)",
      type: "STRING",
      required: false,
      choices: [
        { name: "General", value: "meme" },
        { name: "Programming", value: "programming" },
        { name: "Dark", value: "dark" },
        { name: "Wholesome", value: "wholesome" },
        { name: "Pun", value: "pun" },
        { name: "Cat", value: "cat" },
      ],
    },
  ],
  run: async (client, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: false });

      const category = interaction.options.getString("category") || "meme";
      const response = await fetch(`https://meme-api.com/gimme/${category}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      if (!data || !data.url) {
        return interaction.editReply("Couldn't find a meme in that category or the API response was invalid!");
      }

      const embed = new MessageEmbed()
        .setTitle(data.title)
        .setURL(data.postLink)
        .setImage(data.url)
        .setColor("RANDOM")
        .setFooter({ text: `👍 ${data.ups}` });

      return interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("Meme command error:", error);
      try {
        if (!interaction.deferred && !interaction.replied) {
          await interaction.reply("Something went wrong while fetching your meme.");
        } else {
          await interaction.followUp({ content: "Something went wrong while fetching your meme.", ephemeral: true });
        }
      } catch (e) {
        console.warn("Double interaction fail suppressed:", e.message);
      }
    }
  }

};
