import { Ionicons } from "@expo/vector-icons";
import { ApplicationStatus, MessageKind } from "../../types/job-application";

export const MESSAGE_KIND_META: Record<
  MessageKind,
  { label: string; hint: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  FOLLOW_UP: { label: "Follow up", hint: "Check in when you have not heard back", icon: "time-outline" },
  THANK_YOU: { label: "Say thank you", hint: "After an interview, while it is fresh", icon: "heart-outline" },
  ACCEPT_OFFER: { label: "Accept the offer", hint: "Say yes and ask what happens next", icon: "checkmark-circle-outline" },
  NEGOTIATE_OFFER: { label: "Ask to discuss the offer", hint: "Open a conversation about the package", icon: "chatbubbles-outline" },
  DECLINE_OFFER: { label: "Decline the offer", hint: "Say no and keep the door open", icon: "close-circle-outline" },
  REJECTION_REPLY: { label: "Reply to the rejection", hint: "Thank them and ask for feedback", icon: "mail-outline" },
};

export const MESSAGES_FOR_STATUS: Record<ApplicationStatus, MessageKind[]> = {
  SAVED: [],
  APPLIED: ["FOLLOW_UP"],
  INTERVIEWING: ["THANK_YOU", "FOLLOW_UP"],
  OFFER: ["ACCEPT_OFFER", "NEGOTIATE_OFFER", "DECLINE_OFFER"],
  REJECTED: ["REJECTION_REPLY"],
  WITHDRAWN: [],
};
