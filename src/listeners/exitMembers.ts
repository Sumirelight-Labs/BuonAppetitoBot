import {Listener} from "@sapphire/framework";
import {EmbedBuilder, GuildMember, PartialGuildMember} from "discord.js";
import {date2Timestamp} from "../utils/dateUtil";
import {logger} from "../utils/logs";

export class ExitGuildMember extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "guildMemberRemove"
        });
    }

    public async run(member: GuildMember | PartialGuildMember) {
        const date = new Date().getTime()
        const joinDate = member.joinedTimestamp

        if (joinDate == null) {
            logger.error(`Can't get Member(id: ${member.id}) join time.`)
            return
        }
        const rtaTime = joinDate - date
        if(60 <= rtaTime) {
            logger.info(`Member(id: ${member.id}) is not RTA Player.`)
        }

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setThumbnail(member.displayAvatarURL())
            .setTitle("即抜けRTA!")
            .addFields(
                {name: "走者: ", value: `${member.displayName}(id: ${member.id})`},
                {name: "記録: ", value: `${(date - joinDate) / 1000}秒！`},
                {name: "参加時刻/退出時刻", value: `${date2Timestamp(joinDate, "T")}/${date2Timestamp(date, "T")}`}
            )

        await member.guild.systemChannel?.send({embeds: [embed]})
    }
}