import AsyncStorage from "@react-native-async-storage/async-storage";
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
};

     const deleteDish = async () => {
      if(!selectedDish){
        Alert.alert(
          "No Dish Selected",
           "Please search for and select a dish"
        );
        return;
      }

      try {
         const savedDishes = await AsyncStorage.getItem("dishes");

      const currentDishes: Dish[] = savedDishes
        ? JSON.parse(savedDishes)
        : [];

        const updatedDishes = currentDishes.filter(
        (dish) => String(dish.id) !== String(selectedDish.id)
      );

      if (updatedDishes.length === currentDishes.length) {
        Alert.alert(
          "Dish Not Found",
          "This dish could not be found in the menu. Please refresh and try again."
        );

        setSelectedDish(null);
        await loadDishes();
        return;
      }

      await AsyncStorage.setItem(
        "dishes",
        JSON.stringify(updatedDishes)
      );

       setDishes(updatedDishes);
      setSelectedDish(null);
      setSearch("");

        Alert.alert(
        "Deletion Successful",
        "The dish has been successfully removed from the menu."
      );

    } catch (error) {

      console.error("Error deleting dish:", error);

      Alert.alert(
        "Deletion Failed",
        "Something went wrong while deleting the dish. Please try again."
      );
    }
  };

       const confirmDelete = () => {

    if (!selectedDish) {
      Alert.alert(
        "Select a Dish",
        "Please search for and select the dish you want to delete."
      );
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete "${selectedDish.dishName}" from the menu?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: () => {
            deleteDish();
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
       style={styles.webImage} resizeMode="contain"/>


       <Text style={styles.heading}>Delete Dish </Text>
       <Text style={styles.instruction}>
        Search for dish you want to remove from Menu
       </Text>

       <TextInput
       style={styles.input}
       placeholder="Search dish by name..."
       value={search}
       onChangeText={(value) => {
       setSearch(value);
       setSelectedDish(null);
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

        <View style={styles.selectedContainer}>

          <Text style={styles.selectedHeading}>
            Selected Dish
          </Text>

          <Text style={styles.selectedName}>
            {selectedDish.dishName}
          </Text>

          <Text style={styles.details}>
            {selectedDish.description}
          </Text>

        </View>

      )}

     
      <View style={styles.buttonAlign}>

         <Pressable
        onPress={confirmDelete}
        style={styles.deleteButton}
      >
        <Text style={styles.buttonText}>
          Delete Selected Dish
        </Text>
      </Pressable>

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
       <Text style={styles.buttonText}>Home Page</Text>
       </Pressable>
      

      
      </View>
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
     fontSize: 20,
    fontWeight: "bold",
    textAlign:"center",
    marginBottom: 20,
     color: "#354933"
  },
   buttonAlign:{
    justifyContent:"center",
    alignItems:"center",
    gap: 5 ,
    flexDirection: "column",
    width: "100%"
  },
  webImage:{
    width: "100%",
    height: 120,    
  },
   instruction: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  button:{
    backgroundColor:"#6d597a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10
  },
  text:{
    color:"white",
    fontWeight:"bold",
    fontSize:30,
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

  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color:"#cdb4db",
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
    borderColor: "#6d597a",
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
    color:  "#6d597a",
    marginTop: 10,
  },

  selectedContainer: {
    width: "90%",
    backgroundColor: "#e6ffe6",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
  },

  selectedHeading: {
    fontSize: 18,
    fontWeight: "bold",
  },

  selectedName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },

  message: {
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },

  deleteButton: {
    backgroundColor: "#461220",
    width: "90%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  clearButton: {
    backgroundColor: "#6d597a",
    width: "90%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  homeButton: {
    backgroundColor:"#6d597a",
    width: "90%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

});
