import React from "react"
import {Picker} from "@react-native-picker/picker"
import {router} from "expo-router"
import {Alert} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useState} from "react"
import { Text, View, StyleSheet, Image, ScrollView,Pressable, TextInput  } from "react-native";

export default function Index() { 
  const [dishName, setDishName] = useState("");
  const [description,setDescription]= useState("");
  const [selectedCatergory, setSelectedCatergory] = useState("");
  const[price,setPrice]= useState("");



  const saveDish = async() =>{

    if (!dishName || !description || !selectedCatergory|| !price){
    Alert.alert(
    "Missing Dish Information",
    "Please complete all field before saving the Dish to the menu."
            
    );
    return;
    }
    try{
    const newDish ={
    id:Date.now().toString(),
    dishName: dishName,
     description: description,
    catergory: selectedCatergory,
     price: price,
     };
      const existingDishes =
      await AsyncStorage.getItem("dishes");
      const dishes =existingDishes
      ? JSON.parse(existingDishes): [];
      dishes.push(newDish);
      await AsyncStorage.setItem(
  
      "dishes",
        JSON.stringify(dishes)
      );
        
      Alert.alert("Success", "Dish saved successfully onto menu!" );
       
      router.replace("/view");


    }
    catch (error){
    console.error("Error saving dish:",error);
      Alert.alert("Error","The dish could not be saved");
    }
  };
 
  
  return (
    <ScrollView style={styles.container}
     contentContainerStyle={styles.contentContainer}>  

     <Image
     source={require("@/assets/images/Chef Joe.png")}
     style={styles.webImage} resizeMode="contain"
     >
     </Image>
     <View style={styles.formContainer}>
      
       <View>
            <Text style={styles.label}>
                Dish Name
            </Text>
            <TextInput style={styles.input}
            value={dishName}
            onChangeText={setDishName} 
            placeholder="Enter the Dish Name"/>

            <Text style={styles.label}>
                Dish Description
            </Text>
            <TextInput style={styles.input} 
            value={description}
            onChangeText={setDescription} 
            placeholder="Enter the Dish's Description"/>

            <Text style={styles.label}>
           Dish Catergory
            </Text>
          <Picker style={styles.dropDown}
           selectedValue={selectedCatergory}
            onValueChange={(itemValue, itemIndex) =>
            setSelectedCatergory(itemValue)
            }>
           <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
            
          
            <Text style={styles.label}>
                Dish Price
            </Text>
            <TextInput style={styles.input} 
             value={price}
            onChangeText={setPrice} 
            placeholder="Enter the Dish Price"/>

        </View> 
          


      <View style={styles.buttonContainer}>
         

      <Pressable style={styles.button}
      onPress={saveDish} >
        
          <Text style={styles.text} >
          Save Dish to Menu
           </Text>
        
      </Pressable>

      

      <Pressable onPress={()=>{router.push("/home")}}
        style={styles.button}>
        
          <Text style={styles.text}> Home Page </Text>
        
      </Pressable>

      
      </View>
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
  dropContainer:{
    marginStart:10,
    marginBottom:10,
  },
  image:{
    width:"100%",
    height:175,
  },
  webImage:{
    width: "100%",
    height: 120,    
  },
  dropDown:{
    backgroundColor:"pink",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    height:55,
  },
  formContainer:{
    position:"relative",
    backgroundColor:"white",
    borderWidth:1,
    borderColor:"black",
    borderRadius:8,
    padding:16,
    margin: 16,
  },
  counter:{
    position:"absolute",
    top: 8,
    right: 8,
  },
  buttonContainer:{
    marginTop: 16,
    alignItems:"flex-end",
  },
  button:{
    backgroundColor:"blue",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10
  },
  text:{
    color:"white",
    fontWeight:"bold",
  },
  label:{
   fontSize: 16,
    fontWeight:"bold",
    marginTop:12,
    marginBottom: 6,
  },
  input :{
   borderWidth: 1,
    borderColor:"black",
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
  },


  
});