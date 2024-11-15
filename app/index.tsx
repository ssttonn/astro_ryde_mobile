import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function App() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
