import { View, TouchableOpacity, Text, StyleSheet } from "react-native"

export default function Button({callBack, text, onPress, style,color}) {
    const stylesArray = Array.isArray(style) ? style : [style];
    const combinedStyles = StyleSheet.flatten(stylesArray);

    return <View style={[{backgroundColor:"black", padding: 10, borderRadius: 30},combinedStyles]}>
    <TouchableOpacity style={{padding:10}}  onPress={onPress}>
        <Text style={{color:(color?color:'white'), fontSize: 20, fontWeight:"bold", textAlign:"center"}}>{text}</Text>
    </TouchableOpacity>
</View>
}