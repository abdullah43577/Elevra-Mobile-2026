import { View, type ViewProps } from "react-native";
import { clsx } from "clsx";

export interface AppViewProps extends ViewProps {
  className?: string;
}

export const AppView = function ({ className, ...rest }: AppViewProps) {
  return (
    <View {...rest} className={clsx("bg-primary-foreground", className)} />
  );
};
