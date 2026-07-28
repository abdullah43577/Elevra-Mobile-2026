export interface Notification {
  id: string;
  type: "summary" | "resume" | "recording" | "system" | "reminder";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor: string;
  data?: any; // Additional data for deep linking
}
