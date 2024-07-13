import { Image, Platform, Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import { hp, wp } from "../../helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTheme } from "../../constants/provider";
import { ActivityIndicator } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
} from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-toast-message";
import ConfettiCannon from "react-native-confetti-cannon";

const ImagePopUp = () => {
  const theme = getTheme();
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState("");
  const [isConfetti, setIsConfetti] = useState(false);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;
    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const saveFile = async (fileUri) => {
    try {
      if (permissionResponse.status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (album == null) {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } else {
        await requestPermission();
      }
    } catch (err) {
      console.log("Save err: ", err);
    } finally {
      onLoad();
    }
  };

  const downloadImage = async () => {
    const link = item?.webformatURL;
    if (!link) {
      throw new Error("Image URL is missing");
    }
    const fileName = item?.previewURL?.split("/").pop();
    const filePath = FileSystem.documentDirectory + `${fileName}`;
    try {
      const { uri } = await FileSystem.downloadAsync(link, filePath);
      await saveFile(uri);
      setIsConfetti(true);
      showToast(
        "Wallpaper Downloaded!",
        "Enjoy your new wallpaper and give your device a fresh look with our stunning collection of high-quality images ❤️."
      );
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download image!");
    }
  };

  const handleDownloadImage = async () => {
    setStatus("downloading");
    let uri = await downloadImage();
    if (uri) {
      console.log("uri", uri);
    }
  };

  const shareImage = async () => {
    const link = item?.webformatURL;
    if (!link) {
      throw new Error("Image URL is missing");
    }
    const fileName = item?.previewURL?.split("/").pop();
    const filePath = FileSystem.documentDirectory + `${fileName}`;
    try {
      const { uri } = await FileSystem.downloadAsync(link, filePath);
      onLoad();
      return uri;
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download image!");
    }
  };

  const handleShareImage = async () => {
    setStatus("sharing");
    let uri = await shareImage();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  const showToast = (message, description) => {
    Toast.show({
      type: "success",
      text1: message,
      text2: description,
      position: "bottom",
    });
  };

  const toastConfig = {
    success: ({ text1, text2, props, ...rest }) => {
      return (
        <View
          style={{
            padding: 15,
            margin: 10,
            borderRadius: theme.colors.radius.lg,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        >
          <Text
            style={{
              fontSize: hp(2.5),
              fontWeight: theme.colors.fontWeights.semibold,
              color: theme.colors.colors.white,
            }}
          >
            {text1}
          </Text>

          <Text
            style={{
              textAlign: "center",
              fontSize: hp(1.4),
              fontWeight: theme.colors.fontWeights.medium,
              color: theme.colors.colors.white,
              marginTop: 5,
            }}
          >
            {text2}
          </Text>
        </View>
      );
    },
  };

  const onLoad = () => {
    setStatus("");
  };

  return (
    <View
      entering={FadeInLeft.springify().damping(10).mass(1).stiffness(130)}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp(4),
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      experimentalBlurMethod="none"
      blurReductionFactor={1}
      tint="dark"
      intensity={60}
    >
      <Animated.View
        entering={FadeInLeft.springify().damping(10).mass(1).stiffness(130)}
        style={getSize()}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {status == "loading" && (
            <ActivityIndicator
              size="large"
              color={theme.colors.colors.primary}
            />
          )}
        </View>
        <Image
          style={[
            {
              borderRadius: theme.colors.radius.lg,
              borderWidth: 2,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.1)",
              width: 200,
              height: 200,
            },
            getSize(),
          ]}
          source={{ uri: item?.webformatURL }}
          alt="image"
          onLoad={onLoad}
        />
      </Animated.View>

      <View
        style={{
          marginTop: 20,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Animated.View
          entering={FadeInDown.springify().delay(400)}
          style={{
            width: hp(6),
            height: hp(6),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: theme.colors.radius.lg,
            borderCurve: "continuous",
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Entypo name="cross" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.springify().delay(600)}
          style={{
            width: hp(6),
            height: hp(6),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: theme.colors.radius.lg,
            borderCurve: "continuous",
          }}
        >
          {status == "downloading" ? (
            <View>
              <ActivityIndicator
                size="small"
                color={theme.colors.colors.primary}
              />
            </View>
          ) : (
            <Pressable onPress={handleDownloadImage}>
              <Entypo name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View
          entering={FadeInDown.springify().delay(800)}
          style={{
            width: hp(6),
            height: hp(6),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: theme.colors.radius.lg,
            borderCurve: "continuous",
          }}
        >
          {status == "sharing" ? (
            <View>
              <ActivityIndicator
                size="small"
                color={theme.colors.colors.primary}
              />
            </View>
          ) : (
            <Pressable onPress={handleShareImage}>
              <Entypo name="share" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={3000} />
      {isConfetti && (
        <ConfettiCannon
          count={300}
          fallSpeed={4000}
          explosionSpeed={500}
          fadeOut={true}
          autoStartDelay={0}
          autoStart={true}
          onAnimationStop={() => setIsConfetti(false)}
          origin={{ x: -10, y: 0 }}
        />
      )}
    </View>
  );
};

export default ImagePopUp;
