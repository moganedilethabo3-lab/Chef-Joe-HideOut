import React, {use, useCallback, useState} from "react";
import { Picker } from "@react-native-picker/picker";
import {router} from "expo-router"
import { Text, View, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "expo-router"

type Dish= {
  id: string;
  dishName: string;
  description:string;
  catergory: string;
  price: number | string;
};

export default function Index() {
  const[dishes, setDishes] =useState<Dish[]>([]);

  const [search, setSearch] =useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedPrice, setSelectedPrice] =useState("All");

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
      
    }
  };

  useFocusEffect(
   useCallback(()=>{
   loadDishes();
   },[])
  );

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =dish.dishName
    .toLowerCase()
    .includes(search.trim().toLowerCase());

    const matchesCategory = selectedCategory ==="All" || dish.catergory ===selectedCategory;

    const dishPrice = Number(dish.price);

    let matchesPrice =true;

    if (selectedPrice === "Under R500") {
      matchesPrice =dishPrice < 500;
    }

    else if (selectedPrice === "R500 - R750"){
      matchesPrice = dishPrice >= 500 && dishPrice <= 750;
    }
    else if (selectedPrice === "Above R750"){
      matchesPrice = dishPrice > 750;
    }
    return matchesSearch && matchesCategory && matchesPrice;
  }
);

const formatPrice = (price: number | string) => {
  const numericPrice =Number(price);

  if(!Number.isFinite(numericPrice)) {
    return "Price unAvilable";
  }
  return `R${numericPrice.toFixed(2)}`;
};

const clearFilter = () => {
  setSearch("");
  setSelectedCategory("All");
  setSelectedPrice("All");
};
  
  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>
          Dishes On the Menu
        </Text>

        <View style={styles.filterContainer}>
          <Text style={styles.filterlabel}>
            Search for a Dish
          </Text>

          <TextInput style={styles.filterinput}
          placeholder="Enter dish name..."
          onChangeText={setSearch}
         value={search}
          />


         <Text style={styles.label}>
          Filter by Dish Category
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value)
            }
          >
            <Picker.Item label="All Categories" value="All" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        {/* PRICE FILTER */}

        <Text style={styles.label}>
          Filter by Price
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPrice}
            onValueChange={(value) =>
              setSelectedPrice(value)
            }
          >
            <Picker.Item label="All Prices" value="All" />
            <Picker.Item label="Under R50" value="Under R50" />
            <Picker.Item label="R50 - R100" value="R50 - R100" />
            <Picker.Item label="Above R100" value="Above R100" />
          </Picker>
        </View>

        {/* CLEAR FILTERS */}

        <Pressable
          style={styles.clearButton}
          onPress={clearFilter}
        >
          <Text style={styles.text}>
            Clear Search and Filters
          </Text>
        </Pressable>

      </View>

      {/* DISH RESULTS */}

      <Text style={styles.resultHeading}>
        Available Dishes ({filteredDishes.length})
      </Text>

      {dishes.length === 0 ? (

        <Text style={styles.noDishes}>
          No dishes have been added to the menu yet.
        </Text>

      ) : filteredDishes.length === 0 ? (

        <Text style={styles.noDishes}>
          No dishes match your search or selected filters.
        </Text>

      ) : (

        filteredDishes.map((dish) => (

          <View
            key={dish.id}
            style={styles.dishCard}
          >

            <Text style={styles.dishName}>
              {dish.dishName}
            </Text>

            <Text style={styles.label}>
              Description
            </Text>

            <Text style={styles.description}>
              {dish.description}
            </Text>

            <Text style={styles.label}>
              Dish Category
            </Text>

            <Text style={styles.details}>
              {dish.catergory}
            </Text>

            <Text style={styles.label}>
              Dish Price
            </Text>

            <Text style={styles.dishPrice}>
              {formatPrice(dish.price)}
            </Text>

          </View>

        ))

      )}

         <Pressable onPress={()=>{router.push("/home")}}
        style={styles.button}>
        
          <Text style={styles.text}> Home Page </Text>
        
      </Pressable>
    

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor:"#ffff",
  },
   contentContainer:{
    alignItems:"center",
    justifyContent:"center",
  },
  heading:{
    fontSize: 30,
    fontWeight: "bold",
    textAlign:"center",
    marginBottom: 20,
     color: "#354933"
  },
  noDishes:{
    textAlign:"center",
    fontSize: 18,
    marginTop: 30,
     color: "#354933"
  },
   button:{
    backgroundColor:"#6d597a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width:"60%",
    justifyContent: "center"
  },
  text:{
    color:"white",
    fontWeight:"bold",
    textAlign:"center"
  },
  filterContainer: {
    width: "90%",
    backgroundColor: "#cdb4db",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  filterlabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
  },

  filterinput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 12,
   backgroundColor:  "#6d597a",
    fontSize: 16,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    backgroundColor: "pink",
    marginBottom: 8,
    
  },

  clearButton: {
    backgroundColor: "#6d597a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },

  resultHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },


  dishCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: "90%",
  },

  dishName: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    marginTop: 5,
  },

  details: {
    fontSize: 16,
    marginTop: 5,
  },

  dishPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
  },

});