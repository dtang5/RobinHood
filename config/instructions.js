const CONSTANTS = require("./constants");
const CONFIG = require("./config");

async function showInstructions(msg, args) {
    await CONSTANTS.bot.createMessage(msg.channel.id, {
        embed: {
            title: "Galaxy Raider Setup Instructions",
            description: 
            `**Congratulations!** The bot has successfully appeared in your server, and the commands are working. Now, how do you set it up?
            
            This is a super simple process! Make sure you read all the instructions below before starting. 

            **(1)** Run the command \`.config\`. This command will do a bunch of backend stuff generate default roles and channels.
            **You must not delete these roles** without first unregistering them from the bot database (explained below)
            **You must not delete these channels** without first registering them to different channels (explained below).

            Now, the bot has generated you five roles, one for each category of AFK check it performs and the default 'Suspended' role. If you would prefer to have your own roles integrate with the bot, at this point you can register those with this command!

            **(2)** Use the command \`.accessrole moderator @role(s)\` and give yourself whatever role you chose to designate as a moderator role. This will allow you to use the rest of the bot commands and bypass restrictions.
            You can give use this command to give unlimited roles the bot's moderator privileges, however be cautious -- this allows users to bypass bot permissions checks, allowing them to delete auto-generated raiding vcs.
            
            **(3)**Use the commands \`.accessrole member @role(s)\` and \`.accessrole veteran @role(s)\` to assign a "member" role and a "veteran" role. Once again, you can assign as many of these as you'd like.
            
            Tip: You can assign **batches** of permissions to multiple roles. For example, \`.accessrole member @role1 @role2 @role3 @role4...\` will give all of those roles Member privileges in your server.`,
            color: 3145463
        }
    })
    await CONSTANTS.bot.createMessage(msg.channel.id, {
        embed: {
            title: "Galaxy Raider Setup Instructions",
            description: 
            `**(4)** If you have a role for nitro boosters, use the command \`.accessrole booster @role(s)\` to give them early location on your AFK checks (capped at 5 boosters). You can skip this step if you do not want it.

            **(5)** Finally, configure whatever roles will have **leading** access to the bot. 
            What does this mean? You must designate which roles will have access to the .afk functionality, and which types of runs they can start.
            To give a role permission to start afk's for certain runtypes, use the command \`.accessrole <runtypes> @roles\`. For example, \`.accessrole halls @everyone\` will give the @everyone role permission to start halls AFK checks.
            There are ten runtypes you can use in the above command: \`halls, oryx, exaltation, misc, vethalls, vetoryx, vetexaltation, vetmisc, allreg, allvet\`. The 'vet' types will give that role access to the bot's veteran AFK check system.

            You can also assign multiple of these at one time! For example, \`.accessrole halls vethalls vetoryx @role1 @role2 @role3\` will give those three roles access to start halls, vet halls, and vet oryx AFK checks.
            To view the current afk access configuration, type \`.showconfig afkaccess\`
            `,
            color: 3145463,
        }
    })

    return {
        embed: {
            title: "Galaxy Raider Setup Instructions",
            description: 
            `
            Guess what? You're finished with the basic setup!
            If you want to **unregister** the default bot-created roles (or any other roles, from any category) simply type \`.removeAccessRole <types> @roles\`.
            For example, unregistering the role "abc" from all permissions would look like this: \`.removeAccessRole all @abc\` (assuming you properly ping the role).
            Do **NOT** delete roles from the server without first ensuring that they are removed from the bot. This will leave clutter in the database, and will require you to reconfigurate the server at a later point.

            If you want to **register different channels** from the default bot-created channels simply type \`.help changechannel\` for more information.

            How do I reconfigurate the server you might ask? 
            There is a command! The \`.reconfig\` command will **wipe the bot's database entry** for your guild and **delete all bot-generated channels** within your guild. 

            Lastly, if you want to see the server's current configuration, type \`.showconfig\`!

            To get started, go through the above bullet points, assign the roles, and type \`.help\` to see a comprehensive list of available commands!

            Have fun, and Happy Raiding!
            -Theurul`,
            color: 3145463,
            footer: {
                text: "Courtesy of Space Travel Dungeons",
                icon_url: "https://cdn.discordapp.com/attachments/751589431441490082/764948382912479252/SPACE.gif"
            }
        }
    }
}

exports.showInstructions = showInstructions;