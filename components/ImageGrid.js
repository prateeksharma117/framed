import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./ImageCard";
import { getColumnCount, wp } from "../helpers/common";

const ImageGrid = ({ images, router }) => {
  const columns = getColumnCount();
  return (
    <View style={{ minHeight: 3, width: wp(100) }}>
      <MasonryFlashList
        data={images}
        numColumns={2}
        initialNumToRender={1000}
        contentContainerStyle={styles.listContainerStyles}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            columns={columns}
            index={index}
            router={router}
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  listContainerStyles: {
    paddingHorizontal: wp(4),
  },
});
