const { MessageEmbed } = require("discord.js");
const functions = require("../../../structs/functions.js");
const User = require("../../../model/user.js");

module.exports = {
    commandInfo: {
        name: "createhostaccount",
        description: "Creates a host account for OGFN."
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const serverOwnerId = interaction.guild.ownerId;

        if (interaction.user.id !== serverOwnerId) {
            return interaction.editReply({
                content: "Only the server owner can execute this command.",
                ephemeral: true
            });
        }

        const existingHostAccount = await User.findOne({ email: "hostaccountOGFN@dev.fn" });

        if (existingHostAccount) {
            return interaction.editReply({
                content: "A host account has already been created.",
                ephemeral: true
            });
        }

        const username = "DumbHoster";
        const email = "hostaccountOGFN@dev.fn";
        const password = generateRandomPassword(12);

        try {
            await functions.registerUser(null, username, email, password).then(async (resp) => {
                let embed = new MessageEmbed()
                    .setColor(resp.status >= 400 ? "#ff0000" : "#56ff00")
                    .addFields(
                        { name: "Message", value: resp.message },
                        { name: "Username", value: `\`\`\`${username}\`\`\`` },
                        { name: "Email", value: `\`\`\`${email}\`\`\`` },
                        { name: "Password", value: `\`\`\`${password}\`\`\`` },
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "OGFN",
                        iconURL: "https://imgur.com/a/hyedIvQ"
                    });

                if (resp.status >= 400) {
                    return interaction.editReply({ embeds: [embed], ephemeral: true });
                }

                await interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                });
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply({
                content: "An error occurred while creating the host account.",
                ephemeral: true
            });
        }
    }
};

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
