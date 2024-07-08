const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Put a user in timeout')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration of the timeout in minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the timeout')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(duration * 60 * 1000, reason);
      const embed = new EmbedBuilder()
        .setTitle('User Timed Out')
        .setColor('#ff0000')
        .setDescription(`Successfully timed out ${user.tag} for ${duration} minutes`)
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
          { name: 'Duration', value: `${duration} minutes`, inline: true },
          { name: 'Reason', value: reason, inline: true }
        )
        .setFooter({ text: `Timed out by ${interaction.user.tag}` });

      await interaction.reply({ embeds: [embed] });

      const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL);
      if (logChannel) {
        await logChannel.send({ embeds: [embed] });
      } else {
        console.error('Log channel not found');
      }
    } catch (error) {
      console.error(`Failed to timeout user: ${error}`);
      await interaction.reply({ content: `Failed to timeout ${user.tag}`, ephemeral: true });
    }
  }
};
