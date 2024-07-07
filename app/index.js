import { Image, StatusBar, Text, View } from "react-native";
import { Button, PaperProvider} from "react-native-paper";
import { getTheme } from "../constants/provider";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";

export default function Page() {
  const theme = getTheme();
  const router = useRouter();
  return (
    <PaperProvider theme={theme}>
      <View className="flex-1">
        <StatusBar barStyle={"light-content"} />
        <Image
          source={require("../assets/images/img.jpg")}
          resizeMode="cover"
          style={{ width: wp(100), height: hp(100), position: "absolute" }}
        />
        <Animated.View entering={FadeInDown.duration(600)} className="flex-1">
          <LinearGradient
            colors={[
              theme.colors.colors.gradientRGBA1,
              theme.colors.colors.gradientRGBA2,
              theme.colors.colors.gradientColor1,
              theme.colors.colors.gradientColor2,
            ]}
            style={{
              width: wp(100),
              height: hp(65),
              bottom: 0,
              position: "absolute",
            }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.8 }}
          />

          <View className=" flex-1 items-center justify-end gap-4 py-5 p-6">
            <Text
              style={{
                color: theme.colors.colors.title,
                fontWeight: theme.colors.fontWeights.bold,
                fontSize: hp(7),
              }}
            >
              Framed
            </Text>
            <Text
              className="text-center"
              style={{
                fontWeight: theme.colors.fontWeights.medium,
                color: theme.colors.colors.title,
                fontSize: hp(2),
              }}
            >
              Transform your device with stunning, high-definition wallpapers
              that reflect your unique style. Discover endless inspiration with
              our diverse and ever-growing collection.
            </Text>
            <View className="w-full">
              <Button
                onPress={() => router.push("home")}
                mode="contained"
                textColor={theme.colors.colors.buttonText}
                buttonColor={theme.colors.colors.button}
                uppercase
              >
                Get Started
              </Button>
            </View>
          </View>
        </Animated.View>
      </View>
    </PaperProvider>
  );
}
