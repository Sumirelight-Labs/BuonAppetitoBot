import {Listener} from "@sapphire/framework";
import {EmbedBuilder, GuildMember} from "discord.js";
import {logger} from "../utils/logs";

export class JoinGuildMember extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "guildMemberAdd"
        });
    }


    public async run(member: GuildMember) {
        const joinTime = member.joinedTimestamp
        if (joinTime == null) {
            logger.info(`Can't get Member(id: ${member.id}) JoinTime.`)
            return
        }
        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setThumbnail(member.displayAvatarURL())
            .setTitle(`こんにちは！${member.displayName}さん！${member.guild.name}へようこそ！`)
            .setFields({name: "あなたが参加した時刻", value: `<t:${Math.round(joinTime / 1000.0)}:F>`})

        await member.guild.systemChannel?.send({embeds: [embed]})
    }
}