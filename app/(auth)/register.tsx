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
import { create } from "zustand";
import { useValidators } from "@/hooks/useValidators";

enum RegisterStatus {
  Idle,
  Registering,
  Verifying,
  PendingForVerification,
  Success,
  Error,
}

interface RegisterState {
  form: {
    email: string;
    password: string;
    username: string;
    code: string;
  };
  errorMessage?: string;
  registerStatus: RegisterStatus;
  setFormField: (field: string, value: string) => void;
  setRegisterStatus: (status: RegisterStatus, errorMessage?: string) => void;
}

const useRegisterValidators = () => {
  const {form: {email, password, username}} = useRegisterState();

  const { textValidator, emailValidator, passwordValidator } = useValidators();

  const isButtonEnabled = useMemo(() => {
    return (
      textValidator(username, "Username") === "" &&
      emailValidator(email) === "" &&
      passwordValidator(password) === ""
    );
  }, [textValidator, emailValidator, passwordValidator, username, email, password]);

  return {
    isButtonEnabled,
    textValidator,
    emailValidator,
    passwordValidator,
  };
}

const useRegisterState = create<RegisterState>((set) => {
  return {
    form: {
      email: "",
      password: "",
      username: "",
      code: "",
    },
    registerStatus: RegisterStatus.Idle,
    setFormField: (field, value) => {
      set((state) => ({
        ...state,
        form: {
          ...state.form,
          [field]: value,
        },
      }));
    },
    setRegisterStatus: (status, errorMessage) => {
      set((state) => ({
        ...state,
        registerStatus: status,
        errorMessage: errorMessage,
      }));
    },
  };
});


const useRegisterForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isShowingSuccessModal, setIsShowingSuccessModal] = useState(false);
  const {
    form: { email, password, username, code },
    registerStatus,
    errorMessage,
    setFormField,
    setRegisterStatus,
  } = useRegisterState();


  const onRegister = useCallback(async (email: string, password: string) => {
    Keyboard.dismiss()
    if (!isLoaded) {
      return;
    }

    try {
      console.log("Registering...", email, password);
      setRegisterStatus(RegisterStatus.Registering);
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setRegisterStatus(RegisterStatus.PendingForVerification);
    } catch (err:any) {
      setRegisterStatus(RegisterStatus.Error, err.errors[0].longMessage);
    }
  }, [isLoaded, signUp, setRegisterStatus]);

  const onPressVerify = useCallback(async (code: string) => {
    if (!isLoaded) {
      return;
    }

    try {
      setRegisterStatus(RegisterStatus.Verifying)
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      });

      if (completeSignUp.status === "complete") {
        // TODO: Save user to DB
        await setActive({ session: completeSignUp.createdSessionId });
        setRegisterStatus(RegisterStatus.Success);
        setIsShowingSuccessModal(true);
      } else {
        throw new Error("Verification failed");
      }
    } catch (err: any) {
      setRegisterStatus(RegisterStatus.Error, err.message);
    }
  }, [isLoaded, signUp, setActive, setRegisterStatus]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage, [
        {
          text: "OK",
          onPress: () => {
            setRegisterStatus(RegisterStatus.Idle);
          },
        },
      ]);
    }
  }, [errorMessage, setRegisterStatus]);


  return {
      email, password, username, code, registerStatus, setFormField, onRegister, onPressVerify, errorMessage, setRegisterStatus, isShowingSuccessModal
    
  };
};

const RegisterScreen = () => {
  const { email, password, username, code, registerStatus, setFormField, onRegister, onPressVerify, errorMessage, setRegisterStatus, isShowingSuccessModal } = useRegisterForm();
  const { isButtonEnabled, textValidator, emailValidator, passwordValidator } = useRegisterValidators();
  

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
              label="Username"
              validator={useCallback(
                (value: string) => textValidator(value, "Username"),
                [textValidator]
              )}
              value={username}
              icon={icons.person}
              placeholder="Enter your username"
              onChangeText={useCallback((value: string) => {
                setFormField("username", value);
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
              isLoading={registerStatus === RegisterStatus.Registering}
              onPress={() => {
                onRegister(email, password);
              }}
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
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default RegisterScreen;
