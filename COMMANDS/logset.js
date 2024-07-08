const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logset')
    .setDescription('Set the log channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to set as the log channel')
        .setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (!channel.isText()) {
      return interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.LOG_CHANNEL = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply(`Log channel set to ${channel.name}.`);
  }
};
