import {
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import MainButton from "@/components/MainButton";
import { Link, router } from "expo-router";
import OAuthMethod from "@/components/OAuthMethod";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import { useValidators } from "@/hooks/useValidators";
import { create } from "zustand";

interface RegisterState {
  email: string;
  password: string;
  name: string;
  setFormField: (field: string, value: string) => void;
}

const useRegisterState = create<RegisterState>((set) => {
  return {
    email: "",
    password: "",
    name: "",
    setFormField: (field, value) => {
      set((state) => ({
        ...state,
        [field]: value,
      }));
    },
  };
});

const useRegisterHook = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isShowingSuccessModal, setIsShowingSuccessModal] = useState(false);
  const { emailValidator, passwordValidator, textValidator } = useValidators();
  const { email, password, name, setFormField } = useRegisterState();

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onRegister = useCallback(
    async (email: string, password: string) => {
      if (!isLoaded) {
        return;
      }

      try {
        await signUp.create({
          emailAddress: email,
          password: password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

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
        return;
      }
    },
    [isLoaded, signUp, verification]
  );

  const onPressVerify = useCallback(async () => {
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
      return;
    }
  }, [isLoaded, signUp, verification]);

  useEffect(() => {
    if (verification.error) {
      Alert.alert("Error", verification.error, [
        {
          text: "OK",
          onPress: () => {
            setVerification({
              ...verification,
              error: "",
            });
          },
        },
      ]);
    }
  }, [verification.error]);

  const isButtonEnabled = useMemo(() => {
    return (
      emailValidator(email) === "" &&
      passwordValidator(password) === "" &&
      textValidator(name, "Name") === ""
    );
  }, [email, password, name, emailValidator, passwordValidator, textValidator]);

  return {
    email,
    password,
    name,
    setFormField,
    onRegister,
    verification,
    setVerification,
    onPressVerify,
    isButtonEnabled,
    isShowingSuccessModal,
    setIsShowingSuccessModal,
    emailValidator,
    passwordValidator,
    textValidator
  };        
}

const RegisterScreen = () => {
  const {
    email,
    password,
    name,
    setFormField,
    onRegister,
    verification,
    setVerification,
    onPressVerify,
    isButtonEnabled,
    isShowingSuccessModal,
    setIsShowingSuccessModal,
    emailValidator,
    passwordValidator,
    textValidator
  } = useRegisterHook();

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
              validator={useCallback((value: string) => textValidator(value, "Name"), [textValidator])}
              value={name}
              icon={icons.person}
              placeholder="Enter your name"
              onChangeText={useCallback((value: string) => {
                setFormField("name", value);
              }, [])}
            />
            <InputField
              label="Email"
              value={email}
              validator={emailValidator}
              icon={icons.email}
              placeholder="Enter your email"
              onChangeText={useCallback((value: string) => {
                setFormField("email", value);
              }, [])}
            />
            <InputField
              label="Password"
              validator={passwordValidator}
              value={password}
              icon={icons.lock}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={useCallback((value: string) => {
                setFormField("password", value);
              }, [])}
            />
            <MainButton
              title="Register"
              disabled={!isButtonEnabled}
              onPress={() => onRegister(email, password)}
              className={`self-center mt-4 w-full ${isButtonEnabled ? "bg-primary-500" : "bg-primary-200"}`}
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
          <ReactNativeModal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") {
                setIsShowingSuccessModal(true);
              }
            }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="text-2xl font-JakartaExtraBold mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {email}
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
              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}
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
              <MainButton
                className="self-center mt-7 w-full"
                title="Browse Home"
                onPress={() => {
                  setIsShowingSuccessModal(false);
                  setTimeout(() => {
                    router.replace("/home");
                  }, 400);
                }}
              />
            </View>
          </ReactNativeModal>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default RegisterScreen;
