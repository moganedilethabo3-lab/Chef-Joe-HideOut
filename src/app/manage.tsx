import React, {useCallback, useState} from "react";
import {router} from "expo-router"
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "expo-router"

type Dish= {
  id: string;
  dishName: string;
  description:string;
  catergory: string;
  price: string;
};

export default function Index() {
  const[dishes, setDishes] =useState<Dish[]>([]);

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
  
  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>
          Dishes On the Menu
        </Text>
        {dishes.length===0?(
          <Text style={styles.noDishes}>
            No Dishes on the Menu yet.
          </Text>
        ):(
          dishes.map((dish)=>(
            <View 
            key={dish.id}
            style={styles.dishCard}>
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
               Dish Catergory
              </Text>
              <Text style={styles.catergory}>
               {dish.catergory}
              </Text>
              <Text style={styles.label}>
               Dish Price
              </Text>
              <Text style={styles.dishPrice}>
               {dish.price}
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
  },
  noDishes:{
    textAlign:"center",
    fontSize: 18,
    marginTop: 30
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
  dishCard:{
    backgroundColor:"white",
    borderWidth: 1,
    borderColor:"black",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  dishName:{
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
  },
  label:{
    fontSize:18,
    fontWeight:"bold",
    marginTop:8,
  },
  description:{
    fontSize: 18,
    marginTop: 16,
  },
  catergory:{
    fontSize: 18,
    marginTop: 16,
  },
  dishPrice:{
    fontSize: 18,
    marginTop: 16,
  }

});