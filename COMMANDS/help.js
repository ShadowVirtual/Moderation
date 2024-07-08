const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display a list of available commands and their descriptions'),
  async execute(interaction) {
    const commands = interaction.client.commands;

    const embed = new EmbedBuilder()
      .setTitle('Help - List of Available Commands')
      .setColor('#00ff00')
      .setFooter({ text: 'Use the commands wisely!' });

    commands.forEach(command => {
      embed.addFields(
        { name: `/${command.data.name}`, value: `${command.data.description}`, inline: false }
      );
    });

    await interaction.reply({ embeds: [embed] });
  }
};
