const { MessageEmbed } = require("discord.js");
const path = require("path");
const fs = require("fs");
const Users = require('../../../model/user.js');
const Profiles = require('../../../model/profiles.js');
const destr = require("destr");
const config = require('../../../Config/config.json')

module.exports = {
    commandInfo: {
        name: "addall",
        description: "Allows you to give a user all cosmetics. Note: This will reset all your lockers to default",
        options: [
            {
                name: "user",
                description: "The user you want to give the cosmetic to",
                required: true,
                type: 6
            }
        ]
    },
    execute: async (interaction) => {

        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.reply({ content: "You do not have moderator permissions.", ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const selectedUser = interaction.options.getUser('user');
        const selectedUserId = selectedUser?.id;
        try {
            const targetUser = await Users.findOne({ discordId: selectedUserId });
            if (!targetUser) {
                return interaction.editReply({ content: "That user does not own an account" });
            }

            const profile = await Profiles.findOne({ accountId: targetUser.accountId });
            if (!profile) {
                return interaction.editReply({ content: "That user does not have a profile" });
            }

            const allItems = destr(fs.readFileSync(path.join(__dirname, "../../../Config/DefaultProfiles/allathena.json"), 'utf8'));
            if (!allItems) {
                return interaction.editReply({ content: "Failed to parse allathena.json" });
            }

            Profiles.findOneAndUpdate({ accountId: targetUser.accountId }, { $set: { "profiles.athena.items": allItems.items } }, { new: true }, (err, doc) => {
                if (err) {
                    return interaction.editReply({ content: "There was an error updating the profile." });
                }
            });

            const embed = new MessageEmbed()
                .setTitle("Full Locker Added")
                .setDescription("Successfully added all skins (Full Locker) to the selected account")
                .setColor("GREEN")
                .setFooter({
                    text: "OGFN",
                    iconURL: "https://imgur.com/a/hyedIvQ"
                })
                .setTimestamp();
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error("An error occurred:", error);
            interaction.editReply({ content: "An error occurred while processing the request." });
        }
    }
};
