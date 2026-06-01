import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const { width } = Dimensions.get("window");

function TodayTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          color: "#c46d2d",
        }}
      >
        1,240
      </Text>

      <Text style={{ color: "#888", marginTop: 4 }}>kcal</Text>
    </View>
  );
}

function ActivityTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          color: "#c46d2d",
        }}
      >
        48
      </Text>

      <Text style={{ color: "#888", marginTop: 4 }}>minutes</Text>
    </View>
  );
}

function PlansTab() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          color: "#c46d2d",
        }}
      >
        6.3
      </Text>

      <Text style={{ color: "#888", marginTop: 4 }}>km</Text>
    </View>
  );
}

function StatsTabs() {
  return (
    <View
      style={{
        height: 220,
        backgroundColor: "#fff",
        borderRadius: 24,
        overflow: "hidden",
      }}
    >
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          headerShown: false,

          tabBarStyle: {
            backgroundColor: "#fff",
            elevation: 0,
            shadowOpacity: 0,
            //width: '50%',
            height: 50,
          },

          tabBarLabelStyle: {
            textTransform: "none",
            fontWeight: "700",
            fontSize: 15,
          },

          tabBarActiveTintColor: "#c46d2d",
          tabBarInactiveTintColor: "#999",

          tabBarIndicatorStyle: {
            backgroundColor: "#c46d2d",
            height: 3,
            borderRadius: 999,
          },
        }}
      >
        <Tab.Screen name="Today" component={TodayTab} />
        <Tab.Screen name="Activity" component={ActivityTab} />
        <Tab.Screen name="Plans" component={PlansTab} />
      </Tab.Navigator>
    </View>
  );
}

export default function HomePage() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0f0f0f",
      }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
    >

      {/* FIRST TOP TABS */}
      <StatsTabs />

      {/* SECOND CARD */}
      <View
        style={{
          marginTop: 20,
          backgroundColor: "#fff",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          This Week
        </Text>

        <Text style={{ color: "#666", lineHeight: 22 }}>
          Your weekly analytics or app content goes here.
        </Text>
      </View>

      {/* THIRD CARD */}
      <View
        style={{
          marginTop: 20,
          backgroundColor: "#fff",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Badges
        </Text>

        <Text style={{ color: "#666", lineHeight: 22 }}>
          Add achievements, streaks, social stats, etc.
        </Text>
      </View>
    </ScrollView>
  );
}