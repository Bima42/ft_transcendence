import { ChatMessage } from "@prisma/client";
import { ChatMessageDto } from "src/chat/dto/message.dto";
import { UserDto } from "src/users/dto/user.dto";

export const toMessageDto = (msg: ChatMessage, user: UserDto): ChatMessageDto => {
	return {
    content: msg.content,
    sentAt: msg.sentAt,
    updatedAt: msg.updatedAt,
    chatId: msg.chatId,
    author: {
      id: user.id,
      username: user.username,
      avatar: user.avatar
    }
  };
}
