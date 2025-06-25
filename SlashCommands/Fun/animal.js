const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const Discord = module.require("discord.js");

module.exports = {
  name: "animal",
  description: "Get a picture and fact about a specific animal",
  options: [
    {
      name: "animal",
      description: "Pick an animal and get a cute pic of it!",
      type: "STRING",
      required: true,
      choices: [
        { name: "Duck", value: "duck" },
        { name: "Lion", value: "lion" },
        { name: "Giraffe", value: "giraffe" },
        { name: "Dog", value: "dog" },
        { name: "Horse", value: "horse" },
        { name: "Bird", value: "bird" },
        { name: "Cat", value: "cat" },
        { name: "Pig", value: "pig" },
        { name: "Panda", value: "panda" },
      ],
    },
  ],
  run: async (client, interaction) => {
    const animal = interaction.options.getString("animal");

    const animalNameMap = {
      duck: "Duck",
      lion: "Lion",
      giraffe: "Giraffe 🦒",
      dog: "AWW look at this Dawg!",
      horse: "Adorable horse",
      bird: "Birds Are Real.",
      cat: "Cat Gaming",
      pig: "Oinky 🐷 Pig",
      panda: "Awww, check out this panda!",
    };

    try {
      const response = await fetch(`https://api.amymals.xyz/animal/${animal}`);
      const url = await response.json();

      const embed = new MessageEmbed()
        .setColor("#00FF00")
        .setTitle(animalNameMap[animal])
        .setDescription(url.description)
        .setImage(url.image)
        .setFooter(url.fact);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply(`Failed to fetch a ${animalNameMap[animal]} picture. Please try again later.`);
    }
  },
};
