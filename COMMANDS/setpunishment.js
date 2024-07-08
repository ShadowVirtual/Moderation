const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setpunishment')
    .setDescription('Set the punishment for reaching the warning limit')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The punishment command to set')
        .setRequired(true)
        .addChoices(
          { name: 'Kick', value: 'kick' },
          { name: 'Ban', value: 'ban' },
          { name: 'Timeout', value: 'timeout' }
        )),
  async execute(interaction) {
    const command = interaction.options.getString('command');

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.PUNISHMENT_COMMAND = command;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply(`Punishment command set to ${command}.`);
  }
};
