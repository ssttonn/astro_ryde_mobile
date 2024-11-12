import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import React, { memo, ReactNode } from "react";

interface MainButtonProps {
  className?: string;
  children?: ReactNode;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  titleClassName?: string;
  onPress?: (event: any) => void;
}

const MainButtonDefaultClassName = `bg-primary-500 w-11/12 py-5 rounded-full items-center justify-center`;

const MainButton = ({
  className,
  children,
  title,
  disabled,
  isLoading,
  onPress,
  titleClassName: textClassName,
}: MainButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      onPress={onPress}
      className={
        `${MainButtonDefaultClassName} ${className || ""}`
      }
    >
      {isLoading ? (
        <ActivityIndicator color="#161622" />
      ) : (
        children || (
          <Text
            className={textClassName || "text-white font-JakartaBold text-xl"}
          >
            {title ?? ""}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
};

export default memo(MainButton);
