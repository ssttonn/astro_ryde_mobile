import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

const useVideoPlayer = () => {
  const video = useRef<any>(null);
  const [status, setStatus] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isPlaying ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isPlaying]);

  useEffect(() => {
    if (status?.didJustFinish) {
      setIsPlaying(false);
    }

    if (status?.isPlaying !== isPlaying) {
      setIsPlaying(status?.isPlaying);
    }
  }, [status]);

  return { video, status, fadeAnim, isPlaying, setIsPlaying, setVideoStatus: setStatus };
};

export default useVideoPlayer;
