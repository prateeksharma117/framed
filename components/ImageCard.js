import { Image, Pressable } from "react-native";
import React, { useState } from "react";
import { getImageSize, wp } from "../helpers/common";
import { getTheme } from "../constants/provider";
import { Skeleton } from "moti/skeleton";

const ImageCard = ({ item, index, columns, router }) => {
  const theme = getTheme();
  const [loading, setLoading] = useState(true);

  const colorMode = theme.colors.mode.type === "Light" ? "light" : "dark";

  const lastInRow = () => {
    return (index + 1) % columns === 0;
  };

  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "home/image", params: { ...item } })
      }
      style={[
        {
          backgroundColor: theme.colors.colors.background,
          borderRadius: theme.colors.radius.lg,
          borderCurve: "continuous",
          overflow: "hidden",
          marginBottom: wp(2),
        },
        !lastInRow() && { marginRight: wp(2) },
      ]}
    >
      <Skeleton colorMode={colorMode} show={loading}>
        <Image
          style={[{ height: 300, width: "100%" }, getImageHeight()]}
          source={{ uri: item?.webformatURL }}
          onLoad={() => setLoading(false)}
        />
      </Skeleton>
    </Pressable>
  );
};

export default ImageCard;
