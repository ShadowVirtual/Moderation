const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const warningsFilePath = path.resolve(__dirname, '../warnings.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnremove')
    .setDescription('Remove a specific warning from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove a warning from')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('warningnumber')
        .setDescription('The warning number to remove')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const warningNumber = interaction.options.getInteger('warningnumber');

    const warnings = JSON.parse(fs.readFileSync(warningsFilePath, 'utf8'));

    if (!warnings[user.id] || warnings[user.id].length < warningNumber || warningNumber < 1) {
      return interaction.reply({ content: 'Invalid warning number.', ephemeral: true });
    }

    warnings[user.id].splice(warningNumber - 1, 1);

    fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('Warning Removed')
      .setColor('#00ff00')
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Removed Warning #', value: `${warningNumber}`, inline: true }
      )
      .setFooter({ text: `Removed by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });

    const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL);
    if (logChannel) {
      await logChannel.send({ embeds: [embed] });
    } else {
      console.error('Log channel not found');
    }
  }
};
