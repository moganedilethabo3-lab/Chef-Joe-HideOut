
import { router } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable, ScrollView} from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}
     contentContainerStyle={styles.contentContainer}> 
      
     

     <Image
     source={require("@/assets/images/Chef Joe.png")}
     >  
     </Image>

     <Text style={styles.heading}>
       Welcome Chef Joe Hideout!
      </Text>
     
     <View style={styles.imageRow}> 

     <Image
     source={require("@/assets/images/Home Images/View.png")}
     style={styles.image}>
     </Image>

     <Pressable onPress={()=>{router.push("/view")}}>
      <Text style={styles.subHeading}> View Menu </Text>
     </Pressable>



     <Image
     source={require("@/assets/images/Home Images/Add.png")}
     style={styles.image}>
     </Image>
    
     <Pressable onPress={()=>{router.push("/add")}}>
      <Text style={styles.subHeading}> Add New Dish To Menu </Text>
     </Pressable>

     <Image
     source={require("@/assets/images/Home Images/Manage.png")}
     style={styles.image}> 
     </Image>

     <Pressable onPress={()=>{router.push("/manage")}}>
      <Text style={styles.subHeading}> Manage Menu </Text>
     </Pressable>

     </View>






    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:16,
   backgroundColor:"#ffff",

  },
  contentContainer:{
    alignItems:"center",
    justifyContent:"center",
  },
  imageRow:{
    justifyContent:"space-between",
    alignItems:"center",
    gap: 5 ,
    flexDirection: "column"
  },
  image:{
    width:255,
    height:250,
    borderRadius: 10,
  },
  heading:{
   fontSize: 30,
    fontWeight: "bold",
    textAlign:"center",
    marginBottom: 5 ,
    
  },
  subHeading:{
   fontSize: 20,
    fontWeight: "bold",
    textAlign:"center",
    marginBottom: 10,
  },

});
