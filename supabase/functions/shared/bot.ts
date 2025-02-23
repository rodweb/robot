import { Bot } from "https://deno.land/x/grammy@v1.21.1/mod.ts";

export class BotInstance {
  private static instance: Bot;

  private constructor() {}

  public static async getInstance(): Promise<Bot> {
    if (!BotInstance.instance) {
      const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

      if (!telegramBotToken) {
        throw new Error(
          "TELEGRAM_BOT_TOKEN environment variable is not set",
        );
      }

      // TODO: Add bot info
      const bot = new Bot(telegramBotToken);

      bot.catch((err) => {
        console.error("Error in bot:", err);
      });

      await bot.init();
      bot.command("ping", (ctx) => ctx.reply("pong"));

      // Add handler for all messages
      bot.on("message", async (ctx) => {
        await ctx.reply("I received your message: " + ctx.message.text);
      });

      BotInstance.instance = bot;
    }

    return BotInstance.instance;
  }
}
