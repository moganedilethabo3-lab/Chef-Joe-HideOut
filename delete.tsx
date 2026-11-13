import React, { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Dish = {
  id: string;
  dishName: string;
  description: string;
  catergory: string;
  price: string;
};

export default function DeleteDish() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDishId, setSelectedDishId] = useState("");

  const loadDishes = async () => {
    try {
      const savedDishes = await AsyncStorage.getItem("dishes");
      const parsed: Dish[] = savedDishes ? JSON.parse(savedDishes) : [];
      setDishes(parsed);
      if (selectedDishId && !parsed.some(d => d.id === selectedDishId)) {
        setSelectedDishId("");
      }
    } catch (error) {
      console.error("Error loading dishes:", error);
      Alert.alert("Error", "Could not load the dishes.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDishes();
    }, [])
  );

  const confirmDelete = () => {
    if (!selectedDishId) {
      Alert.alert("Select a dish", "Please select the dish you want to delete.");
      return;
    }

    const selectedDish = dishes.find(dish => dish.id === selectedDishId);
    if (!selectedDish) {
      Alert.alert("Dish not found", "Please refresh the screen and try again.");
      return;
    }

    Alert.alert(
      "Confirm deletion",
      `Are you sure you want to delete "${selectedDish.dishName}" from the menu?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedDishes = dishes.filter(dish => dish.id !== selectedDishId);
              await AsyncStorage.setItem("dishes", JSON.stringify(updatedDishes));
              setDishes(updatedDishes);
              setSelectedDishId("");
              Alert.alert("Success", "The dish has been deleted from the menu.");
            } catch (error) {
              console.error("Error deleting dish:", error);
              Alert.alert("Error", "The dish could not be deleted. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={require("@/assets/images/Chef Joe.png")} style={styles.webImage} resizeMode="contain" />
      <Text style={styles.heading}>Delete Dish</Text>

      {dishes.length === 0 ? (
        <Text style={styles.message}>There are currently no dishes to delete.</Text>
      ) : (
        <>
          <Text style={styles.label}>Select the dish you want to delete:</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedDishId} onValueChange={setSelectedDishId}>
              <Picker.Item label="-- Select a dish --" value="" />
              {dishes.map(dish => (
                <Picker.Item key={dish.id} label={dish.dishName} value={dish.id} />
              ))}
            </Picker>
          </View>

          {dishes.filter(dish => dish.id === selectedDishId).map(dish => (
            <View key={dish.id} style={styles.dishCard}>
              <Text style={styles.dishName}>{dish.dishName}</Text>
              <Text>{dish.description}</Text>
              <Text>Category: {dish.catergory}</Text>
              <Text>Price: {dish.price}</Text>
            </View>
          ))}

          <Pressable onPress={confirmDelete} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Delete Selected Dish</Text>
          </Pressable>
        </>
      )}

      <Pressable onPress={() => router.push("/home")} style={styles.button}>
        <Text style={styles.buttonText}>Home Page</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:  1, backgroundColor: "#fff" },
  contentContainer: { alignItems: "center", padding: 16, paddingBottom: 35 },
  webImage: { width: "100%", height: 120 },
  heading: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  label: { alignSelf: "stretch", fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  pickerContainer: { alignSelf: "stretch", borderWidth: 1, borderColor: "#777", borderRadius: 8, marginBottom: 16 },
  dishCard: { alignSelf: "stretch", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 14, marginBottom: 16, gap: 6 },
  dishName: { fontSize: 20, fontWeight: "bold" },
  message: { fontSize: 17, textAlign: "center", marginVertical: 25 },
  button: { backgroundColor: "blue", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginVertical: 7 },
  deleteButton: { backgroundColor: "#b00020" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16, textAlign: "center" },
});
