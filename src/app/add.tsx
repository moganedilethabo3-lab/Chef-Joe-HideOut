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

    if (!dishName.trim() || !description.trim()  || !selectedCatergory.trim() || !price.trim() ){
    Alert.alert(
    "Missing Dish Information",
    "Please complete all field before saving the Dish to the menu."
            
    );
    return;
    }

    if(dishName.trim().length < 2){
      Alert.alert("Invalid Dish Name", "The dish name should contain atleast 2 characters")
      ;return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) {
      Alert.alert(
        "Invalid Price", "Enter a valid price in Rands"
      );return;
    }

    const numericPrice=Number(price)

    if(!Number.isFinite(numericPrice)|| numericPrice <=0) {
      Alert.alert(
        "Invalid Price",
        "The dish price must be grester thsn 0"
      );return;
    }

    try{
    const newDish ={
    id:Date.now().toString(),
    dishName: dishName.trim(),
     description: description.trim(),
    catergory: selectedCatergory.trim(),
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
      [
        {
          text:"OK",
          onpress: () =>{
            setDishName("");
            setDescription("");
            setSelectedCatergory("");
            router.replace("/view");
          },
        },
      ]
        
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
            placeholder="Enter the Dish Name"
            maxLength={50}
            />

            <Text style={styles.label}>
                Dish Description
            </Text>

            <TextInput style={styles.input} 
            value={description}
            onChangeText={setDescription} 
            placeholder="Enter the Dish's Description"
            multiline
            />

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
            placeholder="Enter the Dish Price"
            keyboardType="decimal-pad"
          maxLength={10}
          />
          <Text style={styles.priceHint}>
          Enter the price in South African Rands (R).
        </Text>

        </View> 
          


      <View style={styles.buttonContainer}>
      <View style={styles.buttonAlign}>

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
  buttonAlign:{
    justifyContent:"space-between",
    alignItems:"center",
    gap: 5 ,
    flexDirection: "row"
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
  priceHint: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
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