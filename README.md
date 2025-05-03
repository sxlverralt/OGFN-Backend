# Game Backend Features

## Features

### Locker
- Changing items.
- Changing banner icon and banner color.
- Changing item edit styles.
- Favoriting items.
- Marking items as seen.

### Friends
- Adding friends.
- Accepting friend requests.
- Removing friends.
- Blocking friends.
- Setting nicknames.
- Removing nicknames.

### Item Shop
- Customizable Item Shop.
- Purchasing items from the Item Shop.
- Gifting items to your friends.
- Working Auto Item Shop.

### Refunding
- Fully functional refunding system.

### Discord Bot
- Activate/deactivate the Discord bot.
- Commands with very useful functions.

### Battle Pass (Seasons 2-20)
- Purchase the Battle Pass.
- Purchase Battle Pass levels.
- Gift the Battle Pass (BETA).

### Challenges (Backend)
- Daily missions.
- Weekly missions.
- Replace daily quests.
- Get help from your party to complete missions.

### In-Game Events
- Activate various events, such as the rift in the sky and more!

### Winterfest Event (BETA)
- Full Winterfest event with rewards.  
  Event Dates:
  - 11.31
  - 19.01
  - 23.10

### Support A Creator (SAC)
- Support a creator with the `/createsac {code} {ingame-username}` command on Discord.
- Rewards in V-Bucks for supporting creators.

### Matchmaker
- Improved matchmaker.

### Multiple Gameserver Support
- Enhanced multi-gameserver system.

### Website
- A simple website where users can create accounts to join the game.

### XMPP
- Parties.
- Chat (whispering, global chat, party chat).
- Friends.

### HTTPS/SSL Support
- Fully functional HTTPS/SSL system.

---

## TO-DO
- Differentiate ports between XMPP and Matchmaker.
- Add support for "Save the World".

---

## Discord Bot Commands

### User Commands
- `/create {email} {username} {password}` - Creates an account on the backend (1 account per user).
- `/details` - Retrieves your account information.
- `/lookup {username}` - Retrieves another user's account information.
- `/exchange-code` - Generates a one-time exchange code for login (expires in 5 minutes if unused).
- `/change-username {newUsername}` - Change your username.
- `/change-email {newEmail}` - Change your email.
- `/change-password {newPassword}` - Change your password.
- `/sign-out-of-all-sessions` - Sign out of all active sessions.
- `/vbucksamount` - Displays your V-Bucks balance.
- `/giftvbucks {username}` - Send V-Bucks to another user.
- `/claimvbucks` - Claim your daily V-Bucks (default: 250).

### Admin Commands
> **Note:** Admin commands are available only to moderators.
- `/addall {user}` - Grant all cosmetics to a user. *(Resets all lockers to default)*.
- `/addvbucks {user} {vbucks}` - Add V-Bucks to a user's account.
- `/additem {user} {cosmeticname}` - Grant a specific cosmetic to a user.
- `/ban {targetUsername}` - Ban a user by their username.
- `/createsac {code} {ingame-username}` - Create a Support A Creator code.
- `/delete {username}` - Delete a user's account.
- `/deletediscord {username}` - Delete a user's account via Discord.
- `/deletesac {username}` - Delete a Support A Creator code.
- `/kick {targetUsername}` - Kick a user out of their current session.
- `/removevbucks {user} {vbucks}` - Remove V-Bucks from a user's account.
- `/removeitem {user} {cosmeticname}` - Remove a cosmetic from a user's account.
- `/unban {targetUsername}` - Unban a user by their username.

---

## Contributing
Feel free to contribute by submitting issues or pull requests!

---

## License
This project is licensed under the [MIT License](LICENSE).
