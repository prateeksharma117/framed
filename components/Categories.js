import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { data } from "../constants/constants";
import { hp, wp } from "../helpers/common";
import { getTheme } from "../constants/provider";
import Animated, { FadeInRight } from "react-native-reanimated";

const Categories = ({ activeCategory, handelChangeCategory }) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data.category}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory === item}
          handelChangeCategory={handelChangeCategory}
          title={item}
          index={index}
        />
      )}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const CategoryItem = ({ title, index, handelChangeCategory, isActive }) => {
  const theme = getTheme();
  let color = isActive ? theme.colors.colors.title : theme.colors.colors.title;
  let backgroundColor = isActive
    ? theme.colors.colors.inputs
    : theme.colors.colors.background;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <Pressable
        onPress={() => handelChangeCategory(isActive ? null : title)}
        className=" p-3"
        style={[
          {
            borderWidth: 1,
            borderRadius: theme.colors.radius.lg,
            borderColor: theme.colors.colors.border,
            borderCurve: "continuous",
          },
          { backgroundColor },
        ]}
      >
        <Text
          style={[
            { fontSize: hp(1.8), fontWeight: theme.colors.fontWeights.medium },
            { color },
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
});
