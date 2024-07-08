const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeoutremove')
    .setDescription('Remove a user from timeout')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove from timeout')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(null);
      const embed = new EmbedBuilder()
        .setTitle('Timeout Removed')
        .setColor('#00ff00')
        .setDescription(`Successfully removed timeout from ${user.tag}`)
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})`, inline: true }
        )
        .setFooter({ text: `Timeout removed by ${interaction.user.tag}` });

      await interaction.reply({ embeds: [embed] });

      const logChannel = interaction.guild.channels.cache.get(config.LOG_CHANNEL);
      if (logChannel) {
        await logChannel.send({ embeds: [embed] });
      } else {
        console.error('Log channel not found');
      }
    } catch (error) {
      console.error(`Failed to remove timeout from user: ${error}`);
      await interaction.reply({ content: `Failed to remove timeout from ${user.tag}`, ephemeral: true });
    }
  }
};
