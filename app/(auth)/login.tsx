import React, { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import InputField from "@/components/InputField";
import MainButton from "@/components/MainButton";
import OAuthMethod from "@/components/OAuthMethod";
import { icons, images } from "@/constants";
import { Link } from "expo-router";

const LoginScreen = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onLogin = () => {
    console.log(form);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <Image
              source={images.signUpCar}
              className="z-0 w-full h-[250px]"
              resizeMode="cover"
            />
            <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
              Welcome Back
            </Text>
          </View>

          <View className="p-5">
            <InputField
              label="Email"
              value={form.email}
              icon={icons.email}
              placeholder="Enter your email"
              onChangeText={(value) => {
                setForm({ ...form, email: value });
              }}
            />
            <InputField
              label="Password"
              value={form.password}
              icon={icons.lock}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={(value) => {
                setForm({ ...form, password: value });
              }}
            />

            <MainButton
              title="Login"
              onPress={onLogin}
              className="mt-4 w-full"
            />

            <OAuthMethod />
            <View className="self-center mt-3 flex-row">
              <Text className="text-lg text-general-200">
                Don't have an account?{" "}
              </Text>
              <Link href={"/register"}>
                <Text className="text-lg text-primary-500">Register</Text>
              </Link>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default LoginScreen;
