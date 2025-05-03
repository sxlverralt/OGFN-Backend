const Users = require('../../../model/user');
const Profiles = require('../../../model/profiles');
const config = require('../../../Config/config.json');
const uuid = require("uuid");
const { MessageEmbed } = require("discord.js");

module.exports = {
    commandInfo: {
        name: "addvbucks",
        description: "Lets you change a user's amount of V-Bucks",
        options: [
            {
                name: "user",
                description: "The user you want to change the V-Bucks of",
                required: true,
                type: 6
            },
            {
                name: "vbucks",
                description: "The amount of V-Bucks you want to give (Can be negative to deduct V-Bucks)",
                required: true,
                type: 4
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });
        }

        const selectedUser = interaction.options.getUser('user');
        const selectedUserId = selectedUser?.id;
        const user = await Users.findOne({ discordId: selectedUserId });

        if (!user) {
            return interaction.editReply({ content: "That user does not own an account", ephemeral: true });
        }

        const vbucks = parseInt(interaction.options.getInteger('vbucks'));
        if (isNaN(vbucks) || vbucks === 0) {
            return interaction.editReply({ content: "Invalid V-Bucks amount specified.", ephemeral: true });
        }

        const filter = { accountId: user.accountId };
        const update = { $inc: { 'profiles.common_core.items.Currency:MtxPurchased.quantity': vbucks } };
        const options = { new: true };

        const updatedProfile = await Profiles.findOneAndUpdate(filter, update, options);
        if (!updatedProfile) {
            return interaction.editReply({ content: "That user does not own an account", ephemeral: true });
        }

        const common_core = updatedProfile.profiles["common_core"];
        const newQuantity = common_core.items['Currency:MtxPurchased'].quantity;

        if (newQuantity < 0 || newQuantity >= 1000000) {
            return interaction.editReply({
                content: "V-Bucks amount is out of valid range after the update.",
                ephemeral: true
            });
        }

        const purchaseId = uuid.v4();
        const lootList = [{
            "itemType": "Currency:MtxGiveaway",
            "itemGuid": "Currency:MtxGiveaway",
            "quantity": vbucks
        }];

        common_core.items[purchaseId] = {
            "templateId": `GiftBox:GB_MakeGood`,
            "attributes": {
                "fromAccountId": `[Administrator]`,
                "lootList": lootList,
                "params": {
                    "userMessage": `Thanks For Playing OGFN!`
                },
                "giftedOn": new Date().toISOString()
            },
            "quantity": 1
        };

        let ApplyProfileChanges = [
            {
                "changeType": "itemQuantityChanged",
                "itemId": "Currency:MtxPurchased",
                "quantity": newQuantity
            },
            {
                "changeType": "itemAdded",
                "itemId": purchaseId,
                "templateId": "GiftBox:GB_MakeGood"
            }
        ];

        common_core.rvn += 1;
        common_core.commandRevision += 1;
        common_core.updated = new Date().toISOString();

        await Profiles.updateOne(filter, { $set: { 'profiles.common_core': common_core } });

        const embed = new MessageEmbed()
            .setTitle("V-Bucks Updated")
            .setDescription(`Successfully added **${vbucks}** V-Bucks to <@${selectedUserId}> with a GiftBox`)
            .setThumbnail("https://i.imgur.com/yLbihQa.png")
            .setColor("GREEN")
            .setFooter({
                text: "OGFN",
                iconURL: "https://imgur.com/a/hyedIvQ"
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], ephemeral: true });

        return {
            profileRevision: common_core.rvn,
            profileCommandRevision: common_core.commandRevision,
            profileChanges: ApplyProfileChanges,
            newQuantity
        };
    }
};
