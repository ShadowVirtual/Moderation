const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFilePath = path.resolve(__dirname, '../warnings.json');
const configPath = path.resolve(__dirname, '../config.json');

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

    // Read the config file dynamically
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const warningLimit = config.WARNING_LIMIT;

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

    await interaction.reply({ embeds: [embed], ephemeral: true });

    const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL);
    if (logChannel) {
      await logChannel.send({ embeds: [embed] });
    } else {
      console.error('Log channel not found');
    }

    if (warningNumber >= warningLimit) {
      const punishmentCommand = config.PUNISHMENT_COMMAND.toLowerCase();
      try {
        const member = await interaction.guild.members.fetch(user.id);
        if (punishmentCommand === 'kick') {
          if (!member.kickable) {
            throw new Error('Missing Permissions to kick the user.');
          }
          await member.kick(`Reached warning limit: ${reason}`);
          await interaction.followUp({ content: `${user.tag} has been kicked for reaching the warning limit.`, ephemeral: true });
        } else if (punishmentCommand === 'ban') {
          if (!member.bannable) {
            throw new Error('Missing Permissions to ban the user.');
          }
          await interaction.guild.members.ban(user.id, { reason: `Reached warning limit: ${reason}` });
          await interaction.followUp({ content: `${user.tag} has been banned for reaching the warning limit.`, ephemeral: true });
        } else if (punishmentCommand === 'timeout') {
          const timeoutDuration = 10 * 60 * 1000; // 10 minutes
          if (!member.manageable) {
            throw new Error('Missing Permissions to timeout the user.');
          }
          await member.timeout(timeoutDuration, `Reached warning limit: ${reason}`);
          await interaction.followUp({ content: `${user.tag} has been put in timeout for reaching the warning limit.`, ephemeral: true });
        } else {
          console.error(`Unknown punishment command: ${punishmentCommand}`);
        }
      } catch (error) {
        console.error(`Failed to apply punishment: ${error}`);
        await interaction.followUp({ content: `Failed to apply punishment to ${user.tag}: ${error.message}`, ephemeral: true });
      }
    }
  }
};
