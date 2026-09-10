import { Text, View, StyleSheet, ScrollView, Image, Pressable} from "react-native";
import {router} from "expo-router"

export default function Index() {
  return (
   <ScrollView style={styles.container}
     contentContainerStyle={styles.contentContainer}>  
     

     <Image
     source={require("@/assets/images/Chef Joe.png")}
       style={styles.webImage}/>

      <Text style={styles.heading}>Dish Information</Text>

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
  webImage:{
    width: "100%",
    height: 120,    
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
    fontSize:30,
  },
});