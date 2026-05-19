import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import festivalData from "./assets/data/eclipsefest_data.json";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");

  const renderContent = () => {
    if (activeTab === "Home") {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.title}>{festivalData.festivalName}</Text>
          <Text style={styles.date}>July 18-20, 2026</Text>
          <View style={styles.coverPlaceholder}>
            <Text style={styles.placeholderText}>
              (Cover Image / Animation goes here)
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <FlatList
          data={festivalData.performers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.performerName}>{item.name}</Text>
                <Text style={styles.performerDetails}>
                  {item.stage} | {item.startTime} - {item.endTime}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={24} color="#bb86fc" />
              </TouchableOpacity>
            </View>
          )}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Fejléc */}
      <View style={styles.header}>
        <Text style={styles.headerText}>EclipseFest</Text>
      </View>

      {/* Fő tartalom */}
      <View style={styles.mainArea}>{renderContent()}</View>

      {/* Alsó navigáció */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("Home")}
        >
          <Ionicons
            name={activeTab === "Home" ? "home" : "home-outline"}
            size={24}
            color={activeTab === "Home" ? "#bb86fc" : "#888"}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "Home" && styles.activeNavText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("Schedule")}
        >
          <Ionicons
            name={activeTab === "Schedule" ? "calendar" : "calendar-outline"}
            size={24}
            color={activeTab === "Schedule" ? "#bb86fc" : "#888"}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "Schedule" && styles.activeNavText,
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Sötét háttér
  },
  header: {
    padding: 15,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainArea: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#bb86fc",
    marginBottom: 5,
  },
  date: {
    fontSize: 18,
    color: "#cccccc",
    marginBottom: 30,
  },
  coverPlaceholder: {
    width: "80%",
    height: 200,
    backgroundColor: "#2c2c2c",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  placeholderText: {
    color: "#888",
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  performerName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  performerDetails: {
    color: "#aaaaaa",
    marginTop: 5,
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    paddingBottom: 20, // Kicsi extra hely az iPhone-ok alsó vonala miatt
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    color: "#bb86fc",
  },
});
