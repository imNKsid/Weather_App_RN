import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { ICONS, IMAGES } from "../assets";
import { debounce } from "../utils/common-utils";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";

const Home = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState<any>({});

  useEffect(() => {
    fetchCurrentWeatherData();
  }, []);

  const fetchCurrentWeatherData = async () => {
    fetchWeatherForecast({
      cityName: "Bangalore",
      days: 7,
    }).then((data) => {
      console.log("Curr data =>", JSON.stringify(data));
      setWeather(data);
    });
  };

  const handleLocation = (loc) => {
    setLocations([]);
    setShowSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: 7,
    }).then((data) => {
      setWeather(data);
    });
  };

  const handleSearch = (text) => {
    if (text.length > 2) {
      fetchLocations({ cityName: text }).then((data) => {
        setLocations(data);
      });
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 1000);

  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={IMAGES.bg}
        className="absolute h-full w-full"
      />
      <SafeAreaView className="flex flex-1">
        {/* Search Section */}
        <View style={{ height: "7%" }} className="mx-4 relative z-50">
          <View
            className="flex-row justify-end items-center rounded-full"
            style={{
              backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent",
            }}
          >
            {showSearch ? (
              <TextInput
                onChangeText={debouncedHandleSearch}
                placeholder="Search City"
                placeholderTextColor={"lightgray"}
                className="pl-6 h-10 pb-1 flex-1 text-base text-white"
              />
            ) : null}
            <TouchableOpacity
              onPress={() => setShowSearch(!showSearch)}
              style={{ backgroundColor: theme.bgWhite(0.3) }}
              className="rounded-full p-3 m-1"
            >
              <MagnifyingGlassIcon size={25} color={"white"} />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
              {locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? " border-b-2 border-b-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className={
                      "flex-row items-center border-0 p-3 px-4 mb-1" +
                      borderClass
                    }
                  >
                    <MapPinIcon size={20} color={"gray"} />
                    <Text className="text-black text-lg ml-2">
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* Forecast Section */}
        <View className="mx-4 flex justify-around flex-1 mb-8">
          {/* Location */}
          <Text className="text-white text-center text-2xl font-bold">
            {location?.name},
            <Text className="text-lg font-semibold text-gray-300">{` ${location?.country}`}</Text>
          </Text>

          {/* Weather image */}
          <View className="flex-row justify-center">
            <Image
              source={{ uri: `https:${current?.condition?.icon}` }}
              className="w-52 h-52"
            />
          </View>

          {/* Degree Celcius */}
          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center text-white text-xl tracking-widest">
              {current?.condition?.text}
            </Text>
          </View>

          {/* Other Stats */}
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image source={ICONS.wind} className="h-6 w-6" />
              <Text className="text-white font-semibold text-base">
                {current?.wind_kph}km
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={ICONS.drop} className="h-6 w-6" />
              <Text className="text-white font-semibold text-base">
                {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={ICONS.sun} className="h-6 w-6" />
              <Text className="text-white font-semibold text-base">
                {weather?.forecast?.forecastday[0]?.astro?.sunrise}
              </Text>
            </View>
          </View>
        </View>

        {/* Forecast for next days */}
        <View className="mb-8 space-y-5">
          <View className="flex-row items-center mx-5 space-x-2">
            <CalendarDaysIcon size={25} color={"white"} />
            <Text className="text-white text-base">Daily Forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            {weather?.forecast?.forecastday?.map((item, index) => {
              let date = new Date(item?.date);
              let options: any = { weekday: "long" };
              let dayName = date.toLocaleDateString("en-US", options);
              dayName = dayName.split(",")[0];

              return (
                <View
                  className="flex justify-center items-center w-28 rounded-3xl py-7 space-y-1 mr-4"
                  style={{ backgroundColor: theme.bgWhite(0.15) }}
                  key={index}
                >
                  <Image
                    source={{ uri: `https:${item?.day?.condition?.icon}` }}
                    className="h-12 w-12"
                  />
                  <Text className="text-white">{dayName}</Text>
                  <Text className="text-white text-xl font-semibold">
                    {item?.day?.avgtemp_c}&#176;
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;
