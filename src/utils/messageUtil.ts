import {EmbedBuilder, Message} from "discord.js";
import {logger} from "./logs";

//引数指定を直感的にするためのもの
export enum MessageTypes {
    DELETE, SEND, EDIT
}

export async function embedMaker(message: Message, messageType: MessageTypes) {
    //新しくEmbedBuilderを生成
    const embed = new EmbedBuilder()
    //サムネイル、説明、フッターの生成
    embed.setThumbnail(message.author.displayAvatarURL())
        .setDescription(`ユーザー: <@${message.author.id}>/メッセージUrl: ${message.url}`)
        //ここでの時刻はメッセージが[送信、変更、削除]された時間です
        //なので、`new Date()`で現在時刻を取得、toStringで日付のフォーマットに変換してます
        .setFooter({text: `時刻: ${new Date().toString()}`})

    //タイトル生成用のラムダ
    const title = (str: string) => `メッセージが${str}されました！`

    //キャッシュからメッセージを取るヤツ
    //なんか動いただけなのであんまり理解してません
    const generateCacheMessage = async () => {
        const channel = message.client.channels.cache.get(message.channelId)
        if(channel == undefined || !channel.isSendable()) {
            return
        }
        const newMessageCollection = await channel.messages.fetch({cache: true})
        const newMessage = newMessageCollection.get(message.id)
        const fieldArray: {name: string, value: string}[] = [
            {name: "メッセージ初期作成時刻: ", value: `${new Date(message.createdTimestamp).toString()}`},
            {name: "送信されていたメッセージ", value: `\n\`\`\`\n${message.content}\n\`\`\`\n`}
        ]

        //newMessageの中身が存在しないと、content取得時にエラー吐いて止まっちゃうのでifされてます
        if(newMessage != undefined) {
            logger.debug(`Fetched new Message: [${message.content}]` )
            fieldArray.push({name: "編集後メッセージ: ", value: `\n\`\`\`\n${newMessage.content}\n\`\`\`\n`})
        }
        embed.addFields(fieldArray)
    }

    //みんな大好きswitch
    //MessageTypes(Enum)で分岐させてます
    switch (messageType) {
        case MessageTypes.DELETE:
            embed.setTitle(title("消去"))
                .setColor("Red")
            await generateCacheMessage()
            break
        case MessageTypes.EDIT:
            embed.setTitle(title("編集"))
                .setColor("Yellow")
            await generateCacheMessage()
            break
        case MessageTypes.SEND:
            embed.setTitle(title("送信"))
                .setColor("Aqua")
            break
    }
    //それぞれの呼び出し場所へ帰還
    return embed
}