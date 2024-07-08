# Discord Moderation Bot

A powerful Discord bot designed for moderation purposes. It allows server administrators to manage user warnings, apply punishments, and dynamically configure settings.

## Features

- **Warn Users**: Issue warnings to users.
- **View Warnings**: View all warnings for a specific user.
- **Remove Warnings**: Remove specific warnings from a user.
- **Kick Users**: Kick users from the server.
- **Ban Users**: Ban users from the server.
- **Timeout Users**: Temporarily restrict users from interacting.
- **Set Log Channel**: Dynamically set the log channel for moderation actions.
- **Configure Settings**: Change bot settings dynamically, such as the warning limit and punishment command.

## Setup Instructions

### Prerequisites

- Node.js (v16.6.0 or higher)
- npm (Node Package Manager)
- A Discord bot token

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/discord-moderation-bot.git
   cd discord-moderation-bot
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create the `config.json` File**

   Create a `config.json` file in the root directory of the project and add your configuration settings. Use the following template:

   ```json
   {
     "PREFIX": "+",
     "TOKEN": "YOUR_BOT_TOKEN",
     "REVIEWER_ID": "REVIEWER_USER_ID",
     "APPLY_CHANNEL": "APPLY_CHANNEL_ID",
     "LOG_CHANNEL": "LOG_CHANNEL_ID",
     "WARNING_LIMIT": 5,
     "PUNISHMENT_COMMAND": "kick"
   }
   ```

   - Replace `YOUR_BOT_TOKEN` with your actual bot token.
   - Replace `REVIEWER_USER_ID`, `APPLY_CHANNEL_ID`, and `LOG_CHANNEL_ID` with the respective IDs from your Discord server.
   - Adjust `WARNING_LIMIT` and `PUNISHMENT_COMMAND` as needed.

4. **Start the Bot**

   ```bash
   npm start
   ```

### Commands

#### Moderation Commands

- **/warn**: Warn a user.
  - Options: `user` (required), `reason` (optional)
  
- **/warnremove**: Remove a specific warning from a user.
  - Options: `user` (required), `warningnumber` (required)

- **/warnview**: View warnings for a user.
  - Options: `user` (required)

- **/kick**: Kick a user from the server.
  - Options: `user` (required), `reason` (optional)

- **/ban**: Ban a user from the server.
  - Options: `user` (required), `reason` (optional)

- **/timeout**: Put a user in timeout.
  - Options: `user` (required), `duration` (required, in minutes), `reason` (optional)

- **/timeoutremove**: Remove a user from timeout.
  - Options: `user` (required)

- **/unban**: Unban a user by their user ID.
  - Options: `userid` (required)

#### Configuration Commands

- **/logset**: Set the log channel.
  - Options: `channel` (required)

- **/config**: Set various configuration options.
  - Options: `option` (required), `value` (required)
    - Choices for `option`: `PREFIX`, `REVIEWER_ID`, `APPLY_CHANNEL`, `LOG_CHANNEL`, `WARNING_LIMIT`, `PUNISHMENT_COMMAND`

### Contributing

Feel free to submit issues and pull requests for improvements or bug fixes.

### License

This project is licensed under the MIT License.
