import { BotInstance } from "./bot.ts";
import { assertRejects } from "https://deno.land/std@0.219.0/assert/assert_rejects.ts";

Deno.test("BotInstance singleton", () => {
  // Save original env
  const originalToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

  try {
    // Test missing token throws error
    Deno.env.delete("TELEGRAM_BOT_TOKEN");
    assertRejects(
      () => BotInstance.getInstance(),
      Error,
      "TELEGRAM_BOT_TOKEN environment variable is not set",
    );
  } finally {
    // Restore original env
    if (originalToken) {
      Deno.env.set("TELEGRAM_BOT_TOKEN", originalToken);
    } else {
      Deno.env.delete("TELEGRAM_BOT_TOKEN");
    }
  }
});
