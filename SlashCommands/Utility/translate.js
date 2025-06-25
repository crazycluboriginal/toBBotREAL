const { MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");

const LANG_NAMES = {
  ar:    "Arabic",
  "zh-CN":"Chinese (Simplified)",
  "zh-TW":"Chinese (Traditional)",
  cs:    "Czech",
  da:    "Danish",
  nl:    "Dutch",
  en:    "English",
  fi:    "Finnish",
  fr:    "French",
  de:    "German",
  el:    "Greek",
  he:    "Hebrew",
  hi:    "Hindi",
  hu:    "Hungarian",
  id:    "Indonesian",
  it:    "Italian",
  ja:    "Japanese",
  ko:    "Korean",
  no:    "Norwegian",
  pl:    "Polish",
  pt:    "Portuguese",
  ro:    "Romanian",
  ru:    "Russian",
  es:    "Spanish",
  sv:    "Swedish",
};

module.exports = {
  name: "translate",
  description: "Translates the given message.",
  options: [
    {
      name: "text",
      description: "The text to translate",
      type: 3,       // STRING
      required: true,
    },
    {
      name: "language",
      description: "The target language",
      type: 3,       // STRING
      required: true,
      choices: Object.entries(LANG_NAMES).map(([code, name]) => ({
        name: `${name}`,
        value: code
      })),
    },
  ],

  run: async (client, interaction) => {
    const text     = interaction.options.getString("text");
    const language = interaction.options.getString("language");
    const langName = LANG_NAMES[language] || language;

    try {
      const res = await translate(text, { to: language });
      const embed = new MessageEmbed()
        .setTitle(`Translated from ${langName}`)
        .setDescription(res.text)
        .setColor("RANDOM")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("Error translating text:", err);
      await interaction.reply("Please provide a valid ISO language code.");
    }
  },
};
