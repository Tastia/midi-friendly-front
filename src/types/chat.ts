import { User } from "@/types/user";
export enum MessageType {
  text = "text",
  image = "image",
  audio = "audio",
}

export type ChatMessage = {
  _id: string;
  user: User;
  message: {
    type: `${MessageType}`;
    content: string;
  };
  readBy: string[];
  createdAt: string;
  updatedat: string;
};

export type ChatMessage2 = {
  _id: string;
  user: User;
  message: {
    type: `${MessageType}`;
    content: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ChatRoom = {
  _id: string;
  users: string[];
  messages: ChatMessage[];
  lunchGroup?: { label: string };
  lunchGroupPoll?: { label: string };
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessageDto = {
  roomId: string;
  userId: string;
  message: Omit<ChatMessage["message"], "content"> & { content: string };
};

export enum ChatGatewayReceivedEvents {
  setChatRooms = "setChatRooms",
  addChatRoom = "addChatRoom",
  removeChatRoom = "removeChatRoom",
  messageReceived = "addNewMessage",
  setUserList = "setUserList",
  userConnected = "userConnected",
  userDisconnected = "userDisconnected",
}

export enum ChatGatewayEmittedEvents {
  sendMessage = "SendMessage",
}
