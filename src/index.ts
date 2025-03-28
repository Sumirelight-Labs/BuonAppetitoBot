import {SapphireClient} from "@sapphire/framework";
import {GatewayIntentBits} from "discord.js";
import path from "node:path";
import fs from "node:fs";
import sqlite3 from "sqlite3"
import {logger} from "./utils/logs";
import {executeRunQuery} from "./utils/database"

async function start(): Promise<void> {
    const databaseDirectory = path.join(__dirname, "..", "database");
    try {
        if (!fs.existsSync(databaseDirectory)) {
            fs.mkdirSync(databaseDirectory);
            logger.info(`Created directory: ${databaseDirectory}`);
        } else {
            logger.info(`Directory already exists: ${databaseDirectory}`);
        }
    } catch (err) {
        return logger.error(`Error failed creating directory: "${err}"`);
    }

    const databaseFiles = ["general.sqlite", "support.sqlite"];
    databaseFiles.forEach((fileName) => {
        try {
            const filePath = path.join(databaseDirectory, fileName);
            if (!fs.existsSync(filePath)) {
                const db = new sqlite3.Database(filePath, (err) => {
                    if (err) {
                        return logger.error(`Error failed connect database: "${err}"`);
                    }
                });
                db.close()
                logger.info(`Created database file: ${filePath}`);
            } else {
                logger.info(`Database file already exists: ${filePath}`);
            }
        } catch (e) {
            return logger.error(`Error failed creating database file: "${e}"`);
        }
    })

    const createModeratorRoleTable = `
    CREATE TABLE IF NOT EXISTS moderatorRole
    (
        guildId TEXT NOT NULL,
        roleId TEXT NOT NULL
    );
    `
    const createBumpRoleTable = `
    CREATE TABLE IF NOT EXISTS bumpRole
    (
        guildId TEXT NOT NULL,
        roleId TEXT NOT NULL
    )
    `
    const createSupportRoleTable = `
    CREATE TABLE IF NOT EXISTS supportRole
    (
        guildId TEXT NOT NULL,
        roleId TEXT NOT NULL
    )
    `
    const createSupportChannelTable = `
        CREATE TABLE IF NOT EXISTS supportChannel
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guildId TEXT NOT NULL,
            channelId TEXT,
            userId TEXT NOT NULL
        );
    `
    await executeRunQuery(path.join(databaseDirectory, "general.sqlite"), createModeratorRoleTable);
    await executeRunQuery(path.join(databaseDirectory, "general.sqlite"), createBumpRoleTable);
    await executeRunQuery(path.join(databaseDirectory, "support.sqlite"), createSupportRoleTable);
    await executeRunQuery(path.join(databaseDirectory, "support.sqlite"), createSupportChannelTable);

    const token = process.env.BUON_APPETITO_TOKEN;
    if (!token) {
        return logger.error("No token found");
    }

    const client = new SapphireClient({
        intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
        loadMessageCommandListeners: true
    });

    await client.login(token);
}

start();