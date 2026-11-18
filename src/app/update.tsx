import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";


type Dish = {
  id: string | number;
  dishName: string;
  description: string;
  catergory: string;
  price:number |string;
};

export default function Index() {

  const[dishes, setDishes] =useState<Dish[]>([]);

  const [search, setSearch] =useState("");

 const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

 const [dishName, setDishName ] = useState("");
 const[description, setDescription] = useState("");
 const[selectedCatergory, setSelectedCatergory] = useState("");
 const[price, setPrice] = useState("");

  const loadDishes =async ()=>{
    try{

      const savedDishes= await AsyncStorage.getItem("dishes");
      if (savedDishes){
        const parsedDishes =JSON.parse(savedDishes);
        setDishes(parsedDishes);
      }
      else{
        setDishes([]);
      }
    }
    catch(error){
      console.error("There has been an error loading dish/;",error);
       Alert.alert(
        "Error",
        "Unable to load the menu."
      );
    }
  };

    useFocusEffect(
     useCallback(()=>{
     loadDishes();
     },[])
    );

      const filteredDishes = dishes.filter((dish) => 
    dish.dishName
    .toLowerCase()
    .includes(search.trim().toLowerCase())
     );

     const selectDish = (dish: Dish) => {
     setSelectedDish(dish);
     setDishName(dish.dishName);
     setDescription(dish.description);
     setSelectedCatergory(dish.catergory);
     setPrice(String(dish.price))

     };

       const clearSelection = () => {

    setSelectedDish(null);

    setDishName("");
    setDescription("");
    setSelectedCatergory("");
    setPrice("");

    setSearch("");
  };

  const updateDish = async () => {
    if(!selectedDish) {
      Alert.alert(
        "NO dish selected",
        "Please search and select dish on Menu"
      );
      return;
    }

    if(!dishName.trim() || !description.trim() || !selectedCatergory || !price.trim()
    ) {
  Alert.alert(
    "Missing Information",
    "Please complete all fields before updating the dish"
  );
  return;
}

 if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) {

      Alert.alert(
        "Invalid Price",
        "Enter a valid price in Rands, for example 85 or 85.50."
      );

      return;
    }

     const numericPrice = Number(price);

    // Ensure price is greater than zero
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {

      Alert.alert(
        "Invalid Price",
        "The dish price must be greater than R0.00."
      );

      return;
    }

    try {

      // Retrieve the latest menu
      const savedDishes = await AsyncStorage.getItem("dishes");

      const currentDishes: Dish[] = savedDishes
        ? JSON.parse(savedDishes)
        : [];

         const dishExists = currentDishes.some(
        (dish) =>
          String(dish.id) === String(selectedDish.id)
      );

      if (!dishExists) {

        Alert.alert(
          "Dish Not Found",
          "The selected dish no longer exists in the menu. Please refresh and try again."
        );

        clearSelection();
        await loadDishes();

        return;
      }

       const updatedDishes = currentDishes.map((dish) => {

        if (
          String(dish.id) === String(selectedDish.id)
        ) {

          return {
            ...dish,
            dishName: dishName.trim(),
            description: description.trim(),
            catergory: selectedCatergory,
            price: numericPrice,
          };

        }

        return dish;

      });

      await AsyncStorage.setItem(
        "dishes",
        JSON.stringify(updatedDishes)
      );

      // Update the displayed dishes
      setDishes(updatedDishes);

      const updatedDishName = dishName.trim();
      clearSelection();

        Alert.alert(
        "Update Successful",
        `${updatedDishName} has been successfully updated on the menu.`,
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/view");
            },
          },
        ]
      );

    } catch (error) {

      console.error("Error updating dish:", error);

      Alert.alert(
        "Update Failed",
        "The dish could not be updated. Please try again."
      );

    }
  };
const confirmUpdate = () => {

    if (!selectedDish) {

      Alert.alert(
        "Select a Dish",
        "Please search for and select a dish first."
      );

      return;
    }

    Alert.alert(
      "Confirm Update",
      `Are you sure you want to update "${selectedDish.dishName}"?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Update",
          onPress: () => {
            updateDish();
          },
        },
      ]
    );

  };


  return (
    <ScrollView style={styles.container}
     contentContainerStyle={styles.contentContainer}>  
     <Image
     source={require("@/assets/images/Chef Joe.png")}
     style={styles.webImage} resizeMode="contain"
      />
      <Text style={styles.heading}>Update Dish</Text>

      <Text style={styles.instruction}>
        Search for Dish you want to Upate from Menu
      </Text>

       <TextInput
        style={styles.input}
        placeholder="Search dish by name..."
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          setSelectedDish(null);
          setDishName("");
          setDescription("");
          setSelectedCatergory("");
          setPrice("");
        }}
      />

       <Text style={styles.subHeading}>
        Search Results ({filteredDishes.length})
      </Text>

      {dishes.length === 0 ? (

        <Text style={styles.message}>
          There are currently no dishes on the menu.
        </Text>

      ) : filteredDishes.length === 0 ? (

        <Text style={styles.message}>
          No matching dishes found. Try another name.
        </Text>

      ) : (

        filteredDishes.map((dish) => (

          <Pressable
            key={String(dish.id)}
            onPress={() => selectDish(dish)}
            style={[
              styles.dishCard,
              selectedDish?.id === dish.id &&
                styles.selectedCard,
            ]}
          >

            <Text style={styles.dishName}>
              {dish.dishName}
            </Text>

            <Text style={styles.details}>
              Category: {dish.catergory}
            </Text>

            <Text style={styles.details}>
              Price: R{Number(dish.price).toFixed(2)}
            </Text>

            <Text style={styles.selectText}>
              {selectedDish?.id === dish.id
                ? "Selected"
                : "Tap to select this dish"}
            </Text>

          </Pressable>

        ))

      )}

        {selectedDish && (

        <View style={styles.formContainer}>

          <Text style={styles.formHeading}>
            Edit Dish Information
          </Text>

          <Text style={styles.label}>
            Dish Name
          </Text>

          <TextInput
            style={styles.input}
            value={dishName}
            onChangeText={setDishName}
            placeholder="Enter dish name"
            maxLength={50}
          />

          <Text style={styles.label}>
            Dish Description
          </Text>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter dish description"
            multiline
          />

          <Text style={styles.label}>
            Dish Category
          </Text>

          <View style={styles.pickerContainer}>

            <Picker
              selectedValue={selectedCatergory}
              onValueChange={(value) =>
                setSelectedCatergory(value)
              }
            >

              <Picker.Item
                label="Select Dish Category"
                value=""
              />

              <Picker.Item
                label="Main Course"
                value="Main Course"
              />

              <Picker.Item
                label="Starter"
                value="Starter"
              />

              <Picker.Item
                label="Dessert"
                value="Dessert"
              />

            </Picker>

          </View>

          <Text style={styles.label}>
            Dish Price (R)
          </Text>

          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Example: 85.50"
            keyboardType="decimal-pad"
            maxLength={10}
          />

          <Text style={styles.priceHint}>
            Enter the price in South African Rands.
          </Text>

          <Pressable
            onPress={confirmUpdate}
            style={styles.updateButton}
          >

            <Text style={styles.buttonText}>
              Update Selected Dish
            </Text>

          </Pressable>

             <Pressable
            onPress={clearSelection}
            style={styles.clearButton}
          >

            <Text style={styles.buttonText}>
              Cancel / Clear Selection
            </Text>

          </Pressable>

        </View>

      )}

     <View style={styles.buttonAlign}>
      
        <Pressable
               onPress={() => {
                 setSelectedDish(null);
                 setSearch("");
               }}
               style={styles.clearButton}
             >
               <Text style={styles.buttonText}>
                 Clear Search / Selection
               </Text>
             </Pressable>
       

      
      <Pressable
        onPress={() => router.push("/home")}
        style={styles.homeButton}
      >

        <Text style={styles.buttonText}>
          Home Page
        </Text>
        </Pressable>

     </View>
       
    

    </ScrollView>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  contentContainer: {
    alignItems: "center",
    justifyContent:"center",
  },

  webImage: {
    width: "100%",
    height: 120,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
     color: "#354933",
  },

  instruction: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    
  },

  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
     color:"#cdb4db",
  },

  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 13,
   backgroundColor: "#cdb4db",
    fontSize: 16,
    marginBottom: 15,
  },

  dishCard: {
    width: "90%",
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },

  selectedCard: {
    borderColor:  "#6d597a",
    borderWidth: 3,
    backgroundColor: "#e6ffe6",
  },

  dishName: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 8,
  },

  details: {
    fontSize: 16,
    marginTop: 5,
  },

  selectText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6d597a",
    marginTop: 10,
  },

  formContainer: {
    width: "55%",
     backgroundColor: "#cdb4db",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 16,
    marginTop: 15,
  },

  formHeading: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },

  descriptionInput: {
    minHeight: 55,
    textAlignVertical: "top",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    backgroundColor: "pink",
    marginBottom: 10,
  },

  priceHint: {
    color: "gray",
    fontSize: 12,
    marginTop: -5,
  },

  message: {
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },

  updateButton: {
    backgroundColor: "#6d597a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  clearButton: {
    backgroundColor: "#6d597a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "90%",
  },

  homeButton: {
    backgroundColor: "#6d597a",
    width: "90%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    
  },
  buttonAlign: {
  justifyContent: "center",
  alignItems: "center",
  gap: 15,
  flexDirection: "row"
},

});
