const CONSTANTS = require('./constants');
const CONFIG = require('./config');
const RAIDCONSTANTS = require('../raiding_functions/RAIDCONSTANTS');
const Eris = require("eris");

exports.execute = initialize;

async function initialize(msg, args) {
    if (CONFIG.SystemConfig.servers[msg.guildID]) return "Server already configured!";

    let hallsRole, oryxRole, exaltRole, miscRole;

    CONSTANTS.bot.createMessage(msg.channel.id, "Creating new bot access roles...");
    hallsRole = await CONSTANTS.bot.createRole(msg.guildID, {
        name: "Bot Halls Access"
    })
    oryxRole = await CONSTANTS.bot.createRole(msg.guildID, {
        name: "Bot Oryx Access"
    })
    exaltRole = await CONSTANTS.bot.createRole(msg.guildID, {
        name: "Bot Exaltations Access"
    })
    miscRole = await CONSTANTS.bot.createRole(msg.guildID, {
        name: "Bot Misc Access"
    })
    let suspendRole = await CONSTANTS.bot.createRole(msg.guildID, {
        name: "Suspended",
        color: 0x000000
    })

    msg.member.addRole(hallsRole.id, "initial permissions");

    let staffroles = [hallsRole.id, oryxRole.id, exaltRole.id, miscRole.id];
    let afkaccess = {
        "halls": [hallsRole.id],
        "oryx": [oryxRole.id],
        "exaltation": [exaltRole.id],
        "misc": [miscRole.id],
        "vethalls": [hallsRole.id],
        "vetoryx": [oryxRole.id],
        "vetexaltation": [exaltRole.id],
        "vetmisc": [miscRole.id],
        "denyhighreqs": []
    }


    let overwritesLimitedChannels = [{
        id: msg.guildID,
        type: 0,
        allow: 0,
        deny: 1024
    }, {
        id: hallsRole.id,
        type: 0,
        allow: 3072,
        deny: 0
    }, {
        id: oryxRole.id,
        type: 0,
        allow: 3072,
        deny: 0
    }, {
        id: exaltRole.id,
        type: 0,
        allow: 3072,
        deny: 0
    }, {
        id: miscRole.id,
        type: 0,
        allow: 3072,
        deny: 0
    }]

    CONSTANTS.bot.createMessage(msg.channel.id, "Creating necessary channels...");
    let RaidCategory = await CONSTANTS.bot.createChannel(msg.guildID, "Raiding", 4);
    let activeRaidsChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Active Raids", 0, {
        parentID: RaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })
    let raidStatusChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Raid Status", 0, {
        parentID: RaidCategory.id
    })
    let raidCommandsChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Raid Commands", 0, {
        parentID: RaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })
    let locationChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Location", 0, {
        parentID: RaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })
    let reactionChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Early Reactions Log", 0, {
        parentID: RaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })

    let vetRaidCategory = await CONSTANTS.bot.createChannel(msg.guildID, "Veteran Raiding", 4);
    let vetactiveRaidsChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Vet Active Raids", 0, {
        parentID: vetRaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })
    let vetraidStatusChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Vet Raid Status", 0, {
        parentID: vetRaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })
    let vetraidCommandsChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Vet Raid Commands", 0, {
        parentID: vetRaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })
    let vetlocationChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Vet Location", 0, {
        parentID: vetRaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })
    let vetreactionChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Vet Early Reactions Log", 0, {
        parentID: vetRaidCategory.id,
        permissionOverwrites: overwritesLimitedChannels
    })

    let logChannel = await CONSTANTS.bot.createChannel(msg.guildID, "Galaxy Raider Logs", 0, {
        permissionOverwrites: overwritesLimitedChannels
    })

    let verifychannel = await CONSTANTS.bot.createChannel(msg.guildID, "verify", 0, {
        permissionOverwrites: overwritesLimitedChannels
    })
    CONSTANTS.bot.createMessage(verifychannel.id, {
        embed: {
            title: `Verification Instructions`,
            description:
            `Welcome to \`${msg.guild.name}\`! In order to access the server, you will have to first link your ROTMG and Discord accounts.

In order to be verified, you must meet the following requirements:
\`\`\`diff
+ Public RealmEye profile
+ Public RealmEye name history
+ Discord direct messages set so anyone can message you
+ Any other requirements that the bot DMs you.
\`\`\`
            
            Type \`${CONSTANTS.botPrefix}verify\` in a channel to get started.
            
            _Verification, if completed successfully, will assign you all member roles configured in the server. 
            If you don't receive a message from the bot after trying to verify, **you were probably suspended and tried to reverify!**_
            
            __**Have fun, and happy raiding!**__`,
            footer: {
                text: `Server Verification | Courtesy of d.gg/STD`,
                icon_url: msg.guild.iconURL
            },
            color: 0x5b1c80
        }
    })

    let channels = {
        "Main": {
            "RaidCategoryID": RaidCategory.id,
            "RaidCommandsChannelID": raidCommandsChannel.id,
            "RaidStatusChannelID": raidStatusChannel.id,
            "ActiveRaidsChannelID": activeRaidsChannel.id,
            "LocationChannelID": locationChannel.id,
            "EarlyReactionsLogChannelID": reactionChannel.id,
        },
        "Veteran": {
            "RaidCategoryID": vetRaidCategory.id,
            "RaidCommandsChannelID": vetraidCommandsChannel.id,
            "RaidStatusChannelID": vetraidStatusChannel.id,
            "ActiveRaidsChannelID": vetactiveRaidsChannel.id,
            "LocationChannelID": vetlocationChannel.id,
            "EarlyReactionsLogChannelID": vetreactionChannel.id
        }
    }

    CONSTANTS.bot.createMessage(msg.channel.id, "Storing guild configuration in local database...");
    CONFIG.addGuildConfigEntry(msg.guildID, msg.guild.name, suspendRole.id, staffroles, afkaccess, channels, logChannel.id);
    CONSTANTS.bot.createMessage(msg.channel.id, "Success!");
    
}

exports.reconfig = async function(msg, args) {
    if (!CONFIG.SystemConfig.servers[msg.guildID]) return "You can't reconfigurate a server you've never configured! Type \`.config\` first!";

    let msgchannel = CONSTANTS.bot.getChannel(msg.channel.id);

    let collector = new Eris.MessageCollector(msgchannel, {
        timeout: 300000,
        count: 1,
        filter: function(filterMsg) {
            return filterMsg.author.id == msg.author.id;
        }
    })
    collector.run();

    await CONSTANTS.bot.createMessage(msg.channel.id, {
        embed: {
            title: `Reconfiguration Safety Check`,
            description: 
            `Are you **sure** you want to reconfigure the server with the bot?
            
            **__This will:__**
            1. Delete old bot access channels (all channels registered with the bot)
            2. Delete the old server configuration from the bot
            3. Re-create new access channels and default roles
            4. Re-initialize server configuration to default.
            
            **__Would you like to reconfigure the server?__**
            If you have **any doubts** about this process, please type \`no\` and contact the developer for help instead.
            If you are certain you know what you're doing, please type \`yes\``,
            color: 0xff0000
        }
    })

    let hasCollected = false;

    collector.on("collect", async (newmessage) => {
        if (newmessage.content == "no") {
            CONSTANTS.bot.createMessage(msg.channel.id, `Stopped the reconfiguration process.`);
        }
        else if (newmessage.content == "yes") {
            hasCollected = true;
            try {
                CONSTANTS.bot.createMessage(msg.channel.id, "Deleting old bot access channels and database entry...");
        
                const guildChannelIDs = (await CONSTANTS.bot.getRESTGuildChannels(msg.guildID)).map((channel, index) => {
                    return channel.id;
                });
        
                Object.values(CONFIG.SystemConfig.servers[msg.guildID].channels.Main).forEach(async(channel, index) => {
                    if (guildChannelIDs.includes(channel)) await CONSTANTS.bot.deleteChannel(channel, "reconfiguration");
                })
                Object.values(CONFIG.SystemConfig.servers[msg.guildID].channels.Veteran).forEach(async(channel, index) => {
                    if (guildChannelIDs.includes(channel)) await CONSTANTS.bot.deleteChannel(channel, "reconfiguration");
                })
                if (guildChannelIDs.includes(CONFIG.SystemConfig.servers[msg.guildID].logchannel)) await CONSTANTS.bot.deleteChannel(CONFIG.SystemConfig.servers[msg.guildID].logchannel, "reconfiguration");
        
                delete CONFIG.SystemConfig.servers[msg.guildID];
                initialize(msg, args);
            }
            catch(e) {
                console.log("Something happened in reconfig" + e);
            }
        }
        else {
            hasCollected = true;
            CONSTANTS.bot.createMessage(msg.channel.id, `I did not recognize the parameter \`${newmessage.content}\`. Rerun the \`.reconfig\` command and type \`no\` or \`yes\` to decline or accept reconfiguration.`);
        }
    })

    setTimeout(() => {
        if (!hasCollected) CONSTANTS.bot.createMessage(msg.channel.id, `Timed out. Please retry the \`.reconfig\` command.`)
    }, 300000)




    
}