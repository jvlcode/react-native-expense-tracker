import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
export default function BackToHome({navigation,name,to}) {
    const handleBack = () => {
        navigation.navigate(to);
    }
    return <TouchableOpacity onPress={handleBack}>
        <View style={styles.backOption}>
            <Ionicons name="chevron-back-outline" size={24} color="white" />
            <Text style={styles.title}>{name}</Text>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    backOption: {
      flexDirection:"row",
      alignItems:"center",
      gap:2,
      margin:10,
    },
    title: {
      color: "white",
      fontSize:25,
      fontWeight:"bold",
    }
});