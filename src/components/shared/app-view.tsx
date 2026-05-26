import { View, type ViewProps } from "react-native";
import { ThemeColor } from "@/constants/theme";
import { clsx } from "clsx";

export interface AppViewProps extends ViewProps {
  type?: ThemeColor;
  className?: string;
}

export const AppView = function ({ className, ...rest }: AppViewProps) {
  return <View {...rest} className={clsx("bg-white", className)} />;
};
