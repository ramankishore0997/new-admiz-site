import { logger } from "../logger";

/**
 * Minimal Telegram Bot API client (long polling) built on the global fetch API.
 * The bot token is read from TELEGRAM_BOT_TOKEN env var only — never hard-coded,
 * never exposed to the frontend, never returned by any API endpoint.
 */

const ALLOWED_UPDATES = ["message", "callback_query"];

export function getBotToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN;
}

export function isBotConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID);
}

async function apiCall<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
  const token = getBotToken();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = (await res.json()) as { ok: boolean; result?: T; description?: string; error_code?: number };
  if (!data.ok) {
    const err: any = new Error(`Telegram API ${method} failed: ${data.description || "unknown error"}`);
    err.errorCode = data.error_code;
    throw err;
  }
  return data.result as T;
}

async function apiCallMultipart<T>(method: string, form: FormData): Promise<T> {
  const token = getBotToken();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    body: form,
  });
  const data = (await res.json()) as { ok: boolean; result?: T; description?: string; error_code?: number };
  if (!data.ok) {
    const err: any = new Error(`Telegram API ${method} failed: ${data.description || "unknown error"}`);
    err.errorCode = data.error_code;
    throw err;
  }
  return data.result as T;
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number };
    text?: string;
    from?: { id: number };
  };
  callback_query?: {
    id: string;
    from: { id: number };
    message?: {
      message_id: number;
      chat: { id: number };
    };
    data?: string;
  };
}

export interface SendMessageResult {
  message_id: number;
}

export interface ReplyMarkup {
  inline_keyboard?: Array<Array<{ text: string; callback_data: string }>>;
}

// Simple sequential send queue: Telegram rate-limits bursts; all outbound
// messages flow through here with a small delay between calls.
let queueTail: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queueTail.then(task, task);
  queueTail = run.catch(() => undefined).then(() => new Promise((r) => setTimeout(r, 60)));
  return run;
}

export const tgClient = {
  getMe(): Promise<{ id: number; username: string }> {
    return apiCall("getMe");
  },

  getUpdates(offset: number, timeoutSeconds = 25): Promise<TelegramUpdate[]> {
    return apiCall("getUpdates", {
      offset,
      timeout: timeoutSeconds,
      allowed_updates: ALLOWED_UPDATES,
    });
  },

  sendMessage(chatId: number | string, text: string, replyMarkup?: ReplyMarkup): Promise<SendMessageResult> {
    return enqueue(() =>
      apiCall<SendMessageResult>("sendMessage", {
        chat_id: chatId,
        text,
        reply_markup: replyMarkup,
      }),
    );
  },

  editMessageText(chatId: number | string, messageId: number, text: string, replyMarkup?: ReplyMarkup): Promise<SendMessageResult> {
    return enqueue(() =>
      apiCall<SendMessageResult>("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text,
        reply_markup: replyMarkup,
      }),
    );
  },

  sendPhoto(chatId: number | string, photoBuffer: Buffer, caption: string, replyMarkup?: ReplyMarkup): Promise<SendMessageResult> {
    const form = new FormData();
    form.append("chat_id", String(chatId));
    const bytes = new Uint8Array(photoBuffer);
    form.append("photo", new Blob([bytes], { type: "image/png" }), "screenshot.png");
    form.append("caption", caption);
    if (replyMarkup) form.append("reply_markup", JSON.stringify(replyMarkup));
    return enqueue(() => apiCallMultipart<SendMessageResult>("sendPhoto", form));
  },

  answerCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean> {
    return enqueue(() =>
      apiCall<boolean>("answerCallbackQuery", {
        callback_query_id: callbackQueryId,
        text,
        show_alert: false,
      }),
    );
  },
};

export function logTelegramError(context: string, err: any): void {
  logger.warn({ err: err?.message || err, context }, "Telegram error (non-fatal)");
}
