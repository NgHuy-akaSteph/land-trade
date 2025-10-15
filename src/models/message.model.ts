import { BaseModel } from './base.model';
import { User } from './user.model';

export class Message extends BaseModel {
  senderId: string;
  receiverId: string;
  content: string;

  // Relations
  sender?: User | undefined;
  receiver?: User | undefined;

  constructor(
    id: string,
    senderId: string,
    receiverId: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
    sender?: User,
    receiver?: User,
  ) {
    super(id, createdAt, updatedAt, isDeleted);
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.sender = sender;
    this.receiver = receiver;
  }

  toJSON(): object {
    const base = super.toJSON();
    return {
      ...base,
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: this.content,
    };
  }
}
