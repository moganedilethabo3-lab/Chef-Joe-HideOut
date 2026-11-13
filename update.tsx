import React, { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
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

export default function UpdateDish() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDishId, setSelectedDishId] = useState("");
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [catergory, setCatergory] = useState("");
  const [price, setPrice] = useState("");

  const loadDishes = async () => {
    try {
      const savedDishes = await AsyncStorage.getItem("dishes");
      setDishes(savedDishes ? JSON.parse(savedDishes) : []);
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

  const selectDish = (dishId: string) => {
    setSelectedDishId(dishId);
    const dish = dishes.find(item => item.id === dishId);
    if (dish) {
      setDishName(dish.dishName);
      setDescription(dish.description);
      setCatergory(dish.catergory);
      setPrice(dish.price);
    } else {
      setDishName("");
      setDescription("");
      setCatergory("");
      setPrice("");
    }
  };

  const saveChanges = async () => {
    if (!selectedDishId) {
      Alert.alert("Select a dish", "Please select the dish you want to update.");
      return;
    }
    if (!dishName.trim() || !description.trim() || !catergory || !price.trim()) {
      Alert.alert("Missing information", "Please complete all fields before updating the dish.");
      return;
    }

    try {
      const savedDishes = await AsyncStorage.getItem("dishes");
      const currentDishes: Dish[] = savedDishes ? JSON.parse(savedDishes) : [];
      const dishExists = currentDishes.some(dish => dish.id === selectedDishId);

      if (!dishExists) {
        Alert.alert("Dish not found", "This dish may have been deleted. Please reload the screen.");
        return;
      }

      const updatedDishes = currentDishes.map(dish =>
        dish.id === selectedDishId
          ? { ...dish, dishName: dishName.trim(), description: description.trim(), catergory, price: price.trim() }
          : dish
      );

      await AsyncStorage.setItem("dishes", JSON.stringify(updatedDishes));
      setDishes(updatedDishes);
      Alert.alert("Success", "Dish information updated successfully.");
      router.replace("/view");
    } catch (error) {
      console.error("Error updating dish:", error);
      Alert.alert("Error", "The dish could not be updated. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={require("@/assets/images/Chef Joe.png")} style={styles.webImage} resizeMode="contain" />
      <Text style={styles.heading}>Update Dish Information</Text>

      {dishes.length === 0 ? (
        <Text style={styles.message}>There are currently no dishes to update.</Text>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Select a dish to update</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedDishId} onValueChange={selectDish}>
              <Picker.Item label="-- Select a dish --" value="" />
              {dishes.map(dish => (
                <Picker.Item key={dish.id} label={dish.dishName} value={dish.id} />
              ))}
            </Picker>
          </View>

          {selectedDishId !== "" && (
            <>
              <Text style={styles.label}>Dish Name</Text>
              <TextInput style={styles.input} value={dishName} onChangeText={setDishName} placeholder="Enter the dish name" />

              <Text style={styles.label}>Dish Description</Text>
              <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Enter the dish description" multiline />

              <Text style={styles.label}>Dish Category</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={catergory} onValueChange={setCatergory}>
                  <Picker.Item label="-- Select category --" value="" />
                  <Picker.Item label="Main Course" value="Main Course" />
                  <Picker.Item label="Starter" value="Starter" />
                  <Picker.Item label="Dessert" value="Dessert" />
                </Picker>
              </View>

              <Text style={styles.label}>Dish Price</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Enter the dish price" keyboardType="decimal-pad" />

              <Pressable style={styles.button} onPress={saveChanges}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </Pressable>
            </>
          )}
        </View>
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
  webImage: { width: "100%", height: 120 },
  heading: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  formContainer: { alignSelf: "stretch", borderWidth: 1, borderColor: "#777", borderRadius: 8, padding: 16 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#777", borderRadius: 8, padding: 12, fontSize: 16, color: "#111" },
  multiline: { minHeight: 85, textAlignVertical: "top" },
  pickerContainer: { borderWidth: 1, borderColor: "#777", borderRadius: 8, marginBottom: 8 },
  button: { backgroundColor: "blue", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginTop: 16 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16, textAlign: "center" },
  message: { fontSize: 17, textAlign: "center", marginVertical: 25 },
});
