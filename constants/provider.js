import { MD3LightTheme } from "react-native-paper";
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";
import { useColorScheme } from "react-native";

const LightTheme = {
  ...MD3LightTheme,
  colors: lightTheme,
};

const DarkTheme = {
  ...MD3LightTheme,
  colors: darkTheme,
};

const getTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? DarkTheme : LightTheme;
};

export { LightTheme, DarkTheme, getTheme };
