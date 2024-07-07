import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { ActivityIndicator, Icon, PaperProvider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getTheme } from "../../constants/provider";
import { hp, wp } from "../../helpers/common";
import { useCallback, useEffect, useRef, useState } from "react";
import Categories from "../../components/Categories";
import { apiCall } from "../../api/fetchWallpaper";
import ImageGrid from "../../components/ImageGrid";
import { debounce } from "lodash";
import FiltersModel from "../../components/FiltersModel";

let page = 1;

const Home = () => {
  const theme = getTheme();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [filters, setFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);
  const [images, setImages] = useState([]);
  const searchInputRef = useRef();
  const modelRef = useRef();
  const scrollRef = useRef();

  const fetchImage = async (params = { page: 1 }, append = true) => {
    try {
      setIsLoading(true);
      let res = await apiCall(params);
      if (res.success && res?.data?.hits) {
        if (append) setImages([...images, ...res?.data?.hits]);
        else setImages([...res?.data?.hits]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handelChangeCategory = (category) => {
    setActiveCategory(category);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (category) params.category = category;
    fetchImage(params, false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      fetchImage({ page, q: text, ...filters }, false);
    }

    if (text === "") {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      fetchImage({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef?.current?.clear();
  };

  const openFilterModel = () => {
    modelRef?.current?.present();
  };

  const closeFilterModel = () => {
    modelRef?.current?.close();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (searchQuery) params.q = searchQuery;
      fetchImage(params, false);
    }
    closeFilterModel();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (searchQuery) params.q = searchQuery;
      fetchImage(params, false);
    }
    closeFilterModel();
  };

  const clearSpecificFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (searchQuery) params.q = searchQuery;
    fetchImage(params, false);
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffSet = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffSet >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (searchQuery) params.q = searchQuery;
        fetchImage(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <View
        className=" flex-1"
        style={[
          { backgroundColor: theme.colors.colors.background },
          { paddingTop },
        ]}
      >
        <View
          style={{
            marginHorizontal: wp(4),
            paddingVertical: 8,
          }}
          className=" justify-between items-center flex-row"
        >
          <Pressable onPress={handleScrollUp}>
            <Text
              style={{
                fontSize: hp(4),
                fontWeight: theme.colors.fontWeights.bold,
                color: theme.colors.colors.title,
              }}
            >
              Framed
            </Text>
          </Pressable>

          <Pressable onPress={openFilterModel}>
            <Ionicons
              name="filter"
              size={30}
              color={theme.colors.colors.title}
            />
          </Pressable>
        </View>

        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={5}
          ref={scrollRef}
          contentContainerStyle={{ gap: 15 }}
        >
          <View
            className=" flex-row justify-between items-center my-3"
            style={{
              marginHorizontal: wp(4),
              borderWidth: 1,
              borderColor: theme.colors.colors.gray,
              backgroundColor: theme.colors.colors.inputs,
              borderRadius: theme.colors.radius.lg,
            }}
          >
            <View className=" p-3">
              <AntDesign
                name="search1"
                size={24}
                color={theme.colors.colors.title}
              />
            </View>
            <TextInput
              className="flex-1"
              ref={searchInputRef}
              onChangeText={handleTextDebounce}
              placeholder="Search wallpaper..."
              placeholderTextColor={theme.colors.colors.title}
              style={{
                borderRadius: theme.colors.radius.sm,
                paddingVertical: 10,
                color: theme.colors.colors.title,
                fontSize: hp(1.8),
              }}
            />
            {searchQuery && (
              <Pressable
                onPress={() => handleSearch("")}
                className="p-2 mx-2"
                style={{
                  backgroundColor: theme.colors.colors.neutral(0.1),
                  borderRadius: theme.colors.radius.sm,
                }}
              >
                <Entypo
                  name="cross"
                  size={24}
                  color={theme.colors.colors.title}
                />
              </Pressable>
            )}
          </View>

          <View>
            <Categories
              activeCategory={activeCategory}
              handelChangeCategory={handelChangeCategory}
            />
          </View>

          {filters && (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: wp(4), gap: 10 }}
              >
                {Object.keys(filters).map((key, index) => {
                  return (
                    <View
                      key={key}
                      style={{
                        paddingHorizontal: 10,
                        gap: 10,
                        padding: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: theme.colors.colors.inputs,
                        borderRadius: theme.colors.radius.sm,
                      }}
                    >
                      {key == "colors" ? (
                        <View
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: theme.colors.radius.xl,
                            backgroundColor: filters[key],
                          }}
                        />
                      ) : (
                        <Text
                          style={{
                            color: theme.colors.colors.title,
                          }}
                        >
                          {filters[key]}
                        </Text>
                      )}
                      <Pressable onPress={() => clearSpecificFilter(key)}>
                        <Icon
                          source={"close"}
                          size={20}
                          color={theme.colors.colors.title}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {images?.length > 0 ? (
            <ImageGrid images={images} router={router} />
          ) : isLoading ? (
            <View></View>
          ) : (
            <ScrollView>
              <View className="flex justify-center items-center flex-col h-full p-3">
                <Image
                  source={require("../../assets/images/empty.png")}
                  resizeMode="cover"
                  style={{
                    width: wp(30),
                    height: hp(30),
                  }}
                />
                <View>
                  <Text
                    className="text-center text-3xl mb-2"
                    style={{ color: theme.colors.colors.title }}
                  >
                    Bad Request
                  </Text>
                  <Text
                    className="text-center"
                    style={{ color: theme.colors.colors.title }}
                  >
                    Due to an inappropriate request, no images can be delivered
                  </Text>
                </View>
              </View>
            </ScrollView>
          )}
          <View
            style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
          >
            <ActivityIndicator
              size="large"
              color={theme.colors.colors.primary}
            />
          </View>
        </ScrollView>

        <Pressable
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: theme.colors.colors.primary,
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleScrollUp}
        >
          <AntDesign name="arrowup" size={24} color="white" />
        </Pressable>

        <FiltersModel
          modelRef={modelRef}
          filters={filters}
          setFilters={setFilters}
          onClose={closeFilterModel}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </View>
    </PaperProvider>
  );
};

export default Home;
