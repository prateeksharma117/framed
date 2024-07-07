import { Pressable, Text, View } from "react-native";
import { capitalize, hp } from "../helpers/common";
import { getTheme } from "../constants/provider";

export const SectionView = ({ title, content }) => {
  const theme = getTheme();

  return (
    <View className=" gap-4 mt-1">
      <Text
        style={{
          fontSize: hp(2.4),
          fontWeight: theme.colors.fontWeights.medium,
          color: theme.colors.colors.title,
        }}
      >
        {title}
      </Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({ data, filters, setFilters, filterName }) => {
  const theme = getTheme();

  const onSelect = (item) => {
    console.log(item);
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View className=" gap-3 flex-row flex-wrap">
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let color = isActive
            ? theme.colors.colors.title
            : theme.colors.colors.title;
          let backgroundColor = isActive
            ? theme.colors.colors.inputs
            : theme.colors.colors.background;

          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={index}
              className="p-4"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.colors.border,
                borderRadius: theme.colors.radius.md,
                borderCurve: "continuous",
                backgroundColor: backgroundColor,
              }}
            >
              <Text style={{ color: color }}>{capitalize(item)}</Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilters = ({ data, filters, setFilters, filterName }) => {
  const theme = getTheme();

  const onSelect = (item) => {
    console.log(item);
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View className=" gap-4 flex-row flex-wrap mb-5">
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let borderColor = isActive
            ? theme.colors.colors.title
            : theme.colors.colors.background;

          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={index}
              style={{
                borderWidth: 2,
                borderColor: borderColor,
                borderRadius: theme.colors.radius.xl,
                borderCurve: "continuous",
              }}
            >
              <View>
                <View
                  style={{
                    backgroundColor: item,
                    borderRadius: theme.colors.radius.xl,
                    width: 30,
                    height: 30,
                    borderCurve: "continuous",
                  }}
                />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};
