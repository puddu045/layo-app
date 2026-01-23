import { StackParamList } from "../navigation/ChatsStack";

export type RootStackParamList = {
  Journeys: undefined;
  AddJourney: undefined;
  JourneyTabs: {
    journeyId?: string;
    screen?: "ChatStack" | "Matches" | "Requests";
    params?: {
      screen?: keyof StackParamList;
      params?: StackParamList[keyof StackParamList];
    };
  };
  Profile: undefined;
  EditProfile: undefined;
};

export type ChatNotificationData = {
  type: "chat";
  chatId: string;
};

export type NotificationData =
  | {
      type: "NEW_MESSAGE";
      chatId: string;
      senderName: string;
      senderId: string;
      messageId: string;
    }
  | {
      type: "REQUEST";
      requestId: string;
    };
