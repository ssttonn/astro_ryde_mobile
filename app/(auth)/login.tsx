import React, { useCallback, useMemo } from "react";
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
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { create } from "zustand";  
import { useValidators } from "@/hooks/useValidators";

interface LoginState {
  form: {
    email: string;
    password: string;
  };
  loginStatus: LoginStatus;
  setFormField: (field: string, value: string) => void;
  setLoginStatus: (status: LoginStatus) => void;
}

enum LoginStatus {
  Idle,
  Loading,
  Success,
  Error,
}

const useLoginState = create<LoginState>((set) => {
  return {
    form: {
      email: "",
      password: "",
    },
    loginStatus: LoginStatus.Idle,
    setLoginStatus: (status: LoginStatus) => {
      set((state) => {
        return {
          ...state,
          loginStatus: status,
        };
      });
    },
    setFormField: (field, value) => {
      set((state) => {
        return {
          ...state,
          form: {
            ...state.form,
            [field]: value,
          },
        };
      });
    },
  };
});

const useLoginForm = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const router = useRouter();

  const {
    form: { email, password },
    loginStatus,
    setFormField,
    setLoginStatus,
  } = useLoginState();

  const onLogin = useCallback(async () => {
    Keyboard.dismiss();

    if (!isLoaded) {
      return;
    }

    try {
      setLoginStatus(LoginStatus.Loading);
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/home");

        setLoginStatus(LoginStatus.Success);
      } else {
        throw new Error("Sign in failed");
      }
    } catch (error) {
      setLoginStatus(LoginStatus.Error);
      console.error(error);
    }
  }, [isLoaded, signIn, email, password, setLoginStatus, setActive, router]);

  return {
    email,
    password,
    loginStatus,
    setFormField,
    onLogin,
  };
};

const useLoginValidator = () => {
  const { email, password } = useLoginState((state) => state.form);

  const {emailValidator, passwordValidator} = useValidators();

  const isButtonEnabled = useMemo(() => {
    return emailValidator(email) === "" && passwordValidator(password) === "";
  }, [email, password]);

  return {
    emailValidator,
    passwordValidator,
    isButtonEnabled,
  };
}

const LoginScreen = () => {
  const {
    email,
    password,
    loginStatus,
    setFormField,
    onLogin,
  } = useLoginForm();

  const { emailValidator, passwordValidator, isButtonEnabled } = useLoginValidator();

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
              value={email}
              icon={icons.email}
              validator={emailValidator}
              placeholder="Enter your email"
              onChangeText={useCallback((value: string) => {
                setFormField("email", value);
              }, [])}
            />
            <InputField
              label="Password"
              value={password}
              icon={icons.lock}
              validator={passwordValidator}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={useCallback((value: string) => {
                setFormField("password", value);
              }, [])}
            />

            <MainButton
              title="Login"
              isLoading={loginStatus === LoginStatus.Loading}
              disabled={!isButtonEnabled || loginStatus === LoginStatus.Loading}
              onPress={useCallback(() => {
                onLogin();
              }, [email, password])}
              className={`mt-4 w-full h-20 ${(isButtonEnabled && !(loginStatus === LoginStatus.Loading)) ? "bg-primary-500" : "bg-gray-200"}`}
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
