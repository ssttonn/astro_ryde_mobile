import {
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import MainButton from "@/components/MainButton";
import { Link, router } from "expo-router";
import OAuthMethod from "@/components/OAuthMethod";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";

const RegisterScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isShowingSuccessModal, setIsShowingSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onRegister = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setVerification({
        ...verification,
        state: "error",
        error: err.errors[0].longMessage,
      });
      return
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        // TODO: Save user to DB
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        throw new Error("Verification failed");
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "error",
        error: err.errors[0].longMessage,
      });
      return
    }
  };

  useEffect(() => {
    if (verification.error) {
      Alert.alert("Error", verification.error,[
        { text: "OK", onPress: () => {
          setVerification({
            ...verification,
            error: ""
          })
        }},
      ] );
    }
  }, [verification.error])

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
              Create Your Account
            </Text>
          </View>

          <View className="p-5">
            <InputField
              label="Name"
              value={form.name}
              icon={icons.person}
              placeholder="Enter your name"
              onChangeText={(value) => {
                setForm({ ...form, name: value });
              }}
            />
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
              title="Register"
              onPress={onRegister}
              className={`self-center mt-4 w-full`}
            />
            <OAuthMethod />
            <View className="self-center mt-3 flex-row">
              <Text className="text-lg text-general-200">
                Already have an account?{" "}
              </Text>
              <Link href={"/login"}>
                <Text className="text-lg text-primary-500">Login</Text>
              </Link>
            </View>
          </View>
          <ReactNativeModal isVisible={verification.state === "pending"} onModalHide={() => {
            if (verification.state === "success") {
              setIsShowingSuccessModal(true);
            }
          }}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="text-2xl font-JakartaExtraBold mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}
              </Text>
              <InputField
                label="Code"
                icon={icons.lock}
                placeholder="12345"
                value={verification.code}
                keybooardType="numeric"
                onChangeText={(value) => {
                  setVerification({ ...verification, code: value });
                }}
              />
              {verification.error && <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>}
              <MainButton
                title="Verify Email"
                onPress={onPressVerify}
                className="mt-5 bg-success-500 self-center w-full"
              />
            </View>

          </ReactNativeModal>
          <ReactNativeModal isVisible={isShowingSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verified your account.
              </Text>
              <MainButton className="self-center mt-7 w-full" title="Browse Home" onPress={() => {
                setIsShowingSuccessModal(false)
                router.replace("/home")
              }}/>
            </View>
          </ReactNativeModal>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default RegisterScreen;
