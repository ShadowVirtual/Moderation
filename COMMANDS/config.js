const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Set various configuration options')
    .addStringOption(option =>
      option.setName('option')
        .setDescription('The configuration option to set')
        .setRequired(true)
        .addChoices(
          { name: 'Prefix', value: 'PREFIX' },
          { name: 'Reviewer ID', value: 'REVIEWER_ID' },
          { name: 'Apply Channel', value: 'APPLY_CHANNEL' },
          { name: 'Log Channel', value: 'LOG_CHANNEL' },
          { name: 'Warning Limit', value: 'WARNING_LIMIT' },
          { name: 'Punishment Command', value: 'PUNISHMENT_COMMAND' }
        ))
    .addStringOption(option =>
      option.setName('value')
        .setDescription('The value to set for the configuration option')
        .setRequired(true)),
  async execute(interaction) {
    const option = interaction.options.getString('option');
    let value = interaction.options.getString('value');

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    if (option === 'WARNING_LIMIT') {
      value = parseInt(value);
      if (isNaN(value)) {
        return interaction.reply({ content: 'Warning limit must be a number.', ephemeral: true });
      }
    } else if (option === 'LOG_CHANNEL' || option === 'APPLY_CHANNEL') {
      const channel = interaction.guild.channels.cache.get(value.replace('<#', '').replace('>', ''));
      if (!channel || !channel.isText()) {
        return interaction.reply({ content: 'Please provide a valid text channel ID or mention.', ephemeral: true });
      }
      value = channel.id;
    }

    config[option] = value;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply(`Configuration option \`${option}\` set to \`${value}\`.`);
  }
};
