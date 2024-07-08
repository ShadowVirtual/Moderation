const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for kicking the user')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.members.kick(user.id, { reason });
      const embed = new EmbedBuilder()
        .setTitle('User Kicked')
        .setColor('#ff0000')
        .setDescription(`Successfully kicked ${user.tag}`)
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
          { name: 'Reason', value: reason, inline: true }
        )
        .setFooter({ text: `Kicked by ${interaction.user.tag}` });

      await interaction.reply({ embeds: [embed] });

      const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL);
      if (logChannel) {
        await logChannel.send({ embeds: [embed] });
      } else {
        console.error('Log channel not found');
      }
    } catch (error) {
      console.error(`Failed to kick user: ${error}`);
      await interaction.reply({ content: `Failed to kick ${user.tag}`, ephemeral: true });
    }
  }
};
