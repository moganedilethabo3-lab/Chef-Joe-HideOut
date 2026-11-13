import React, { useCallback, useMemo, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Dish = {
  id: string;
  dishName: string;
  description: string;
  catergory: string;
  price: string;
};

export default function ViewDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadDishes = async () => {
    try {
      const savedDishes = await AsyncStorage.getItem("dishes");
      const parsedDishes: Dish[] = savedDishes ? JSON.parse(savedDishes) : [];
      setDishes(parsedDishes);
    } catch (error) {
      console.error("Error loading dishes:", error);
      setDishes([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDishes();
    }, [])
  );

  const filteredDishes = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    return dishes.filter(dish => {
      const matchesName = dish.dishName.toLowerCase().includes(search);
      const matchesCategory = selectedCategory === "All" || dish.catergory === selectedCategory;
      return matchesName && matchesCategory;
    });
  }, [dishes, searchText, selectedCategory]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Dishes On the Menu</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Search for a dish</Text>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Enter dish name..."
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />

        <Text style={styles.filterLabel}>Filter by category</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory}>
            <Picker.Item label="All Categories" value="All" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        {(searchText.length > 0 || selectedCategory !== "All") && (
          <Pressable style={styles.clearButton} onPress={() => { setSearchText(""); setSelectedCategory("All"); }}>
            <Text style={styles.clearButtonText}>Clear Search and Filter</Text>
          </Pressable>
        )}
      </View>

      {dishes.length === 0 ? (
        <Text style={styles.noDishes}>No dishes on the menu yet.</Text>
      ) : filteredDishes.length === 0 ? (
        <Text style={styles.noDishes}>No dishes match your search or selected category.</Text>
      ) : (
        <>
          <Text style={styles.resultCount}>Showing {filteredDishes.length} of {dishes.length} dishes</Text>
          {filteredDishes.map(dish => (
            <View key={dish.id} style={styles.dishCard}>
              <Text style={styles.dishName}>{dish.dishName}</Text>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.detail}>{dish.description}</Text>
              <Text style={styles.label}>Dish Category</Text>
              <Text style={styles.detail}>{dish.catergory}</Text>
              <Text style={styles.label}>Dish Price</Text>
              <Text style={styles.detail}>{dish.price}</Text>
            </View>
          ))}
        </>
      )}

      <Pressable onPress={() => router.push("/home")} style={styles.button}>
        <Text style={styles.buttonText}>Home Page</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { alignItems: "center", padding: 16, paddingBottom: 35 },
  heading: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  filterContainer: { alignSelf: "stretch", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 14, marginBottom: 18 },
  filterLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 7, marginTop: 5 },
  searchInput: { borderWidth: 1, borderColor: "#777", borderRadius: 8, padding: 12, fontSize: 16, color: "#111" },
  pickerContainer: { borderWidth: 1, borderColor: "#777", borderRadius: 8 },
  clearButton: { backgroundColor: "#555", padding: 10, borderRadius: 7, marginTop: 10 },
  clearButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  resultCount: { alignSelf: "flex-start", fontSize: 14, marginBottom: 10, color: "#444" },
  noDishes: { textAlign: "center", fontSize: 18, marginTop: 25, marginBottom: 20 },
  dishCard: { alignSelf: "stretch", backgroundColor: "white", borderWidth: 1, borderColor: "black", borderRadius: 10, padding: 16, marginBottom: 16 },
  dishName: { fontSize: 23, fontWeight: "bold", marginBottom: 8 },
  label: { fontSize: 17, fontWeight: "bold", marginTop: 8 },
  detail: { fontSize: 17, marginTop: 5 },
  button: { backgroundColor: "blue", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
});
