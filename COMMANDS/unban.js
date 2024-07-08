const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by their user ID')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('The ID of the user to unban')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('userid');

    try {
      await interaction.guild.members.unban(userId);
      const embed = new EmbedBuilder()
        .setTitle('User Unbanned')
        .setColor('#00ff00')
        .setDescription(`Successfully unbanned user with ID: ${userId}`)
        .setFooter({ text: `Unbanned by ${interaction.user.tag}` });

      await interaction.reply({ embeds: [embed] });

      const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL);
      if (logChannel) {
        await logChannel.send({ embeds: [embed] });
      } else {
        console.error('Log channel not found');
      }
    } catch (error) {
      console.error(`Failed to unban user: ${error}`);
      await interaction.reply({ content: `Failed to unban user with ID: ${userId}`, ephemeral: true });
    }
  }
};
