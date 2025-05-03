const express = require("express");
const app = express.Router();
const User = require("../model/user.js");
const Profile = require("../model/profiles.js");
const fs = require("fs");
const uuid = require("uuid");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());

app.get("/api/ogfn/vbucks", async (req, res) => {
    const { apikey, username, reason } = req.query;

    if (!apikey || apikey !== config.Api.bApiKey) {
        return res.status(401).json({ code: "401", error: "Invalid or missing API key." });
    }
    if (!username) {
        return res.status(400).json({ code: "400", error: "Missing username." });
    }
    if (!reason) {
        return res.status(400).json({ code: "400", error: "Missing reason." });
    }

    const validReasons = config.Api.reasons;
    const addValue = validReasons[reason];

    if (addValue === undefined) {
        return res.status(400).json({ code: "400", error: `Invalid reason. Allowed values: ${Object.keys(validReasons).join(", ")}.` });
    }

    const apiusername = username.trim().toLowerCase();

    try {
        const user = await User.findOne({ username_lower: apiusername });

        if (!user) {
            return res.status(200).json({ message: "User not found." });
        }

        const filter = { accountId: user.accountId };
        const update = { $inc: { 'profiles.common_core.items.Currency:MtxPurchased.quantity': addValue } };
        const options = { new: true };
        const updatedProfile = await Profile.findOneAndUpdate(filter, update, options);

        if (!updatedProfile) {
            return res.status(404).json({ code: "404", error: "Profile not found or V-Bucks item missing." });
        }

        const common_core = updatedProfile.profiles.common_core;
        const newQuantity = common_core.items['Currency:MtxPurchased'].quantity;

        const purchaseId = uuid.v4();
        const lootList = [{
            "itemType": "Currency:MtxGiveaway",
            "itemGuid": "Currency:MtxGiveaway",
            "quantity": addValue
        }];

        common_core.items[purchaseId] = {
            "templateId": `GiftBox:GB_MakeGood`,
            "attributes": {
                "fromAccountId": `[Administrator]`,
                "lootList": lootList,
                "params": {
                    "userMessage": `All Your Progress From This GamePlay!`
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
        await Profile.updateOne(filter, { $set: { 'profiles.common_core': common_core } });

        return res.status(200).json({
            profileRevision: common_core.rvn,
            profileCommandRevision: common_core.commandRevision,
            profileChanges: ApplyProfileChanges,
            newQuantity
        });

    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ code: "500", error: "Server error. Check console logs for more details." });
    }
});

module.exports = app;