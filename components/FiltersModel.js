import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo } from "react";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { getTheme } from "../constants/provider";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "../helpers/common";
import { CommonFilterRow, SectionView, ColorFilters } from "./FilterView";
import { data } from "../constants/constants";
import Animated, { FadeInDown } from "react-native-reanimated";

const FiltersModel = ({
  modelRef,
  filters,
  setFilters,
  onClose,
  onApply,
  onReset,
}) => {
  const theme = getTheme();
  const snapPoint = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={modelRef}
      index={0}
      snapPoints={snapPoint}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: theme.colors.colors.background }}
      backdropComponent={customBackdrop}
    >
      <BottomSheetScrollView>
        <BottomSheetView
          style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: theme.colors.colors.background,
          }}
        >
          <View className=" flex-1 w-full gap-3 p-3">
            <Text
              style={{
                fontSize: hp(4),
                fontWeight: theme.colors.fontWeights.bold,
                color: theme.colors.colors.title,
              }}
            >
              Filters
            </Text>
            {Object.keys(section).map((sectionName, index) => {
              let sectionView = section[sectionName];
              let sectionData = data.filters[sectionName];
              let title = capitalize(sectionName);
              return (
                <Animated.View
                  entering={FadeInDown.delay(index * 100 + 100)
                    .springify()
                    .damping(11)}
                  className=" flex-1 w-full gap-3 p-3"
                  key={sectionName}
                >
                  <SectionView
                    title={title}
                    content={sectionView({
                      data: sectionData,
                      filters,
                      setFilters,
                      filterName: sectionName,
                    })}
                  />
                </Animated.View>
              );
            })}

            <View className=" flex-1 flex-row justify-center items-center space-x-5 mb-5">
              <Pressable
                onPress={onReset}
                className=" flex-1 p-3 items-center justify-center"
                style={{
                  backgroundColor: theme.colors.colors.error,
                  borderCurve: "continuous",
                  borderRadius: theme.colors.radius.md,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.colors.white,
                    fontSize: hp(2.2),
                    fontWeight: theme.colors.fontWeights.medium,
                  }}
                >
                  Reset
                </Text>
              </Pressable>

              <Pressable
                onPress={onApply}
                className=" flex-1 p-3 items-center justify-center"
                style={{
                  backgroundColor: theme.colors.colors.success,
                  borderCurve: "continuous",
                  borderRadius: theme.colors.radius.md,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.colors.white,
                    fontSize: hp(2.2),
                    fontWeight: theme.colors.fontWeights.medium,
                  }}
                >
                  Apply
                </Text>
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const section = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  image_type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilters {...props} />,
};

const customBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return <Animated.View style={containerStyle} />;
};

export default FiltersModel;

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
