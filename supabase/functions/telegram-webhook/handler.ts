import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { BotInstance } from "../shared/bot.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.21.1/mod.ts";

export async function webhookHandler(
  req: Request,
  _supabaseClient: SupabaseClient,
): Promise<Response> {
  try {
    const bot = await BotInstance.getInstance();
    const handleUpdate = webhookCallback(bot, "std/http");

    await handleUpdate(req);

    return new Response("OK");
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
