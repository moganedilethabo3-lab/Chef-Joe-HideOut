import { Text, View, StyleSheet, ScrollView, Image, Pressable} from "react-native";
import {router} from "expo-router"

export default function Index() {
  return (
   <ScrollView style={styles.container}
     contentContainerStyle={styles.contentContainer}>  
     

     <Image
     source={require("@/assets/images/Chef Joe.png")}
       style={styles.webImage} resizeMode="contain"/>

      <Text style={styles.heading}>Dish Information</Text>

      <View style={styles.buttonAlign}>

       
        <Pressable onPress={()=>{router.push("/home")}}
        style={styles.button}>
        
        <Text style={styles.text}> Home Page </Text>
        
       </Pressable>
       <Pressable style={styles.button}>
        
        <Text style={styles.text}> Delete Dish </Text>
        
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
  },
   buttonAlign:{
    justifyContent:"space-between",
    alignItems:"center",
    gap: 5 ,
    flexDirection: "row"
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