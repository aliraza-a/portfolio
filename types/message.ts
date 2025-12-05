// src/types/message.ts
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  starred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
