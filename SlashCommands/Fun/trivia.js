const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const Discord = module.require("discord.js");
const he = require("he");

module.exports = {
  name: "trivia",
  description: "Get a random trivia question.",
  run: async (client, interaction) => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1');
      const data = await response.json();
      const questionData = data.results[0];

      const category = he.decode(questionData.category);
      const question = he.decode(questionData.question);
      const correctAnswer = he.decode(questionData.correct_answer);
      const incorrectAnswers = questionData.incorrect_answers.map(answer => he.decode(answer));
      const answers = [...incorrectAnswers, correctAnswer].sort();

      // Convert answer choices to letters (A, B, C, ...)
      const answerChoices = answers.map((answer, index) => `${String.fromCharCode(65 + index)}. ${answer}`).join('\n');

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(question)
        .addField('Answer Choices:', answerChoices)
        .addField('Category', category)
        .addField('Answer', `The correct answer is ||*${correctAnswer}*||`)
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('Failed to fetch a trivia question.');
    }
  },
};
