import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Platform,
  Keyboard,
} from "react-native";
import React, { memo, useState } from "react";

interface InputFieldProps {
  label: string;
  labelClassName?: string | undefined;
  value?: string;
  onChangeText?: (value: string) => void;
  icon?: any;
  secureTextEntry?: boolean;
  containerClassName?: string;
  iconClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  validator?: (value: string) => string;
  [x: string]: any;
}

const InputField = ({
  label,
  labelClassName,
  value,
  onChangeText,
  icon,
  secureTextEntry,
  containerClassName,
  iconClassName,
  inputClassName,
  placeholder,
  validator,
  ...props
}: InputFieldProps) => {
  const [hasTyped, setHasTyped] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="my-2 w-full">
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelClassName}`}>
          {label}
        </Text>
        <View
          className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500 ${containerClassName}`}
        >
          {icon && (
            <Image source={icon} className={`w-6 h-6 ml-4 ${iconClassName}`} />
          )}
          <TextInput
            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputClassName} text-left`}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            value={value}
            onChangeText={(value) => {
              if (!hasTyped) setHasTyped(true);
              onChangeText && onChangeText(value);
            }}
            {...props}
          />
         
        </View>
        {hasTyped && validator && value !== undefined && validator(value) !== ""  ? <Text className="text-red-500 mt-1">{validator(value)}</Text>: undefined}
      </View>
    </KeyboardAvoidingView>
  );
};

export default memo(InputField);
