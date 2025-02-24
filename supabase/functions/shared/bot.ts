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
      const bot = new Bot(telegramBotToken, {
        client: {
          timeoutSeconds: 60,
        },
      });

      bot.catch((err) => {
        console.error("Error in bot:", err);
      });

      await bot.init();
      bot.command("ping", (ctx) => ctx.reply("pong"));

      // Add handler for all messages
      bot.on("message", async (ctx) => {
        try {
          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${Deno.env.get("OPENROUTER_API_KEY")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "deepseek/deepseek-r1-distill-llama-70b:free",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are a helpful AI assistant. Provide clear and concise responses.",
                  },
                  {
                    role: "user",
                    content: ctx.message.text,
                  },
                ],
                temperature: 0.7, // Adjust for response creativity
                stream: false, // Set to true if you want to stream the response
              }),
            },
          );

          const data = await response.json();
          console.log(data);
          const reply = data.choices[0].message.content;
          if (reply) {
            await ctx.reply(reply);
          } else {
            await ctx.reply("Sorry, I couldn't generate a response.");
          }
        } catch (error) {
          console.error("Error calling OpenRouter:", error);
          await ctx.reply(
            "Sorry, I encountered an error processing your message.",
          );
        }
      });

      BotInstance.instance = bot;
    }

    return BotInstance.instance;
  }
}
