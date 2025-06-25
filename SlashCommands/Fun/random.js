const fetch = require("node-fetch");
const {MessageEmbed} = require("discord.js");
const Discord = module.require("discord.js");


module.exports = {
  name: "random",
  description: "Sends a completely RANDOM post from Reddit. You've been warned.",
  run: async (client, interaction) => {
    try {
      const response = await fetch("https://www.reddit.com/r/random.json");
      const data = await response.json();
      const post = data.data.children[Math.floor(Math.random() * data.data.children.length)].data;

      let embed = new MessageEmbed()
        .setTitle(post.title)
        .setURL(`https://www.reddit.com${post.permalink}`)
        .setImage(post.url)
        .setColor("RANDOM")
        .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);

await interaction.reply({ embeds: [embed]})
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
