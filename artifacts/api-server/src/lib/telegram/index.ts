import { tgClient, getBotToken, isBotConfigured, logTelegramError } from "./client";
import { handleTelegramUpdate } from "./controller";
import { logger } from "../logger";

let stopped = false;

/**
 * Start the Telegram admin bot (long polling). Disabled cleanly when
 * TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID are not configured — the website
 * is never blocked by Telegram.
 */
export async function startTelegramBot(): Promise<void> {
  if (!getBotToken() || !isBotConfigured()) {
    logger.info("Telegram bot disabled — set TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID to enable.");
    return;
  }
  try {
    const me = await tgClient.getMe();
    logger.info(`Telegram bot connected: @${me.username} (id ${me.id})`);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Telegram bot token invalid — bot disabled");
    return;
  }

  let offset = 0;
  while (!stopped) {
    try {
      const updates = await tgClient.getUpdates(offset);
      for (const update of updates) {
        offset = Math.max(offset, update.update_id + 1);
        try {
          await handleTelegramUpdate(update);
        } catch (err) {
          logTelegramError("processUpdate", err);
        }
      }
    } catch (err: any) {
      logTelegramError("polling", err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  logger.info("Telegram bot stopped.");
}

export function stopTelegramBot(): void {
  stopped = true;
}
