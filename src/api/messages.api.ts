import api from "./client";

export async function fetchMessages(
  chatId: string,
  cursor?: string | null,
  limit = 30
) {
  const res = await api.get(`/chats/${chatId}/messages`, {
    params: { cursor, limit },
  });

  return res.data; // { messages, nextCursor }
}

export async function sendMessage(chatId: string, content: string) {
  const res = await api.post(`/chats/${chatId}/messages`, { content });
  return res.data;
}

export async function markChatAsRead(chatId: string) {
  await api.post(`/chats/${chatId}/read`);
}
