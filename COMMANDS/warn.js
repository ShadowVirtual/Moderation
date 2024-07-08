const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const warningsFilePath = path.resolve(__dirname, '../warnings.json');

if (!fs.existsSync(warningsFilePath)) {
  fs.writeFileSync(warningsFilePath, JSON.stringify({}));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the warning')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const warnings = JSON.parse(fs.readFileSync(warningsFilePath, 'utf8'));

    if (!warnings[user.id]) {
      warnings[user.id] = [];
    }

    const warningNumber = warnings[user.id].length + 1;
    warnings[user.id].push({ warningNumber, reason, date: new Date().toISOString() });

    fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));

    const embed = new EmbedBuilder()
      .setTitle('User Warned')
      .setColor('#ff0000')
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Warning #', value: `${warningNumber}`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Date', value: new Date().toISOString(), inline: true }
      )
      .setFooter({ text: `Warned by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });

    const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL);
    if (logChannel) {
      await logChannel.send({ embeds: [embed] });
    } else {
      console.error('Log channel not found');
    }

    if (warningNumber >= config.WARNING_LIMIT) {
      const punishmentCommand = config.PUNISHMENT_COMMAND.toLowerCase();
      try {
        if (punishmentCommand === 'kick') {
          await interaction.guild.members.kick(user.id, { reason: `Reached warning limit: ${reason}` });
          await interaction.followUp(`${user.tag} has been kicked for reaching the warning limit.`);
        } else if (punishmentCommand === 'ban') {
          await interaction.guild.members.ban(user.id, { reason: `Reached warning limit: ${reason}` });
          await interaction.followUp(`${user.tag} has been banned for reaching the warning limit.`);
        } else if (punishmentCommand === 'timeout') {
          const timeoutDuration = 10 * 60 * 1000; // 10 minutes
          const member = await interaction.guild.members.fetch(user.id);
          await member.timeout(timeoutDuration, `Reached warning limit: ${reason}`);
          await interaction.followUp(`${user.tag} has been put in timeout for reaching the warning limit.`);
        } else {
          console.error(`Unknown punishment command: ${punishmentCommand}`);
        }
      } catch (error) {
        console.error(`Failed to apply punishment: ${error}`);
        await interaction.followUp(`Failed to apply punishment to ${user.tag}.`);
      }
    }
  }
};
