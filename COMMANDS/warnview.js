const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFilePath = path.resolve(__dirname, '../warnings.json');
const configPath = path.resolve(__dirname, '../config.json');

const getProgressBar = (current, max) => {
  const progress = Math.min(current / max, 1);
  const totalBlocks = 10;
  const filledBlocks = Math.round(progress * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;

  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnview')
    .setDescription('View warnings for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view warnings for')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    // Read the config file dynamically
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const warningLimit = config.WARNING_LIMIT;

    const warnings = JSON.parse(fs.readFileSync(warningsFilePath, 'utf8'));

    const warningCount = warnings[user.id] ? warnings[user.id].length : 0;
    const progressBar = getProgressBar(warningCount, warningLimit);

    const embed = new EmbedBuilder()
      .setTitle(`Warnings for ${user.tag}`)
      .setColor('#ff0000')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Total Warnings: ${warningCount}` })
      .addFields({ name: 'Warning Progress', value: `${progressBar} (${warningCount}/${warningLimit})`, inline: false });

    if (warningCount === 0) {
      embed.addFields({ name: 'No Warnings', value: '❌', inline: false });
    } else {
      warnings[user.id].forEach((warning, index) => {
        embed.addFields(
          { name: `Warning #${index + 1}`, value: `**Reason:** ${warning.reason}\n**Date:** ${new Date(warning.date).toLocaleString()}`, inline: false }
        );
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
