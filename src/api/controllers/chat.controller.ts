import { ChatMessage2 } from "./../../types/chat";
import { ChatRoom } from "@/types/chat";
import { ApiInstance } from "@/api/instance";

export const ChatController = {
  getUserRooms: (params: { limit: number; offset: number }) =>
    ApiInstance.get<ChatRoom[]>("/chat", { params }).then((res) => res.data),

  getRoomData: (chatRoomId: string) =>
    ApiInstance.get<ChatRoom>(`/chat/${chatRoomId}`).then((res) => res.data),

  getRoomMessages: (
    chatRoomId: string,
    params: { offset: number; limit: number }
  ) =>
    ApiInstance.get<ChatMessage2[]>(`/chat/${chatRoomId}/messages`, {
      params,
    }).then((res) => res.data),

  markRoomMessagesAsRead: (chatRoomId: string) =>
    ApiInstance.post(`/chat/mark-room-as-read/${chatRoomId}`).then(
      (res) => res.data
    ),
};
