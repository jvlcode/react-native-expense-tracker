import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primaryColor } from '../utils/GlobalStyle';
import Tab from './Tab';
import BackToHome from './BackTo';
const name = "Add Expense";

export default function BaseScreen ({navigation, children, name, backTo}) {
    return <SafeAreaView style={styles.container}>
        {backTo && <BackToHome name={name} navigation={navigation} to="Home"/>}
        {children}
      <Tab activeScreen={name} navigation={navigation} />
	</SafeAreaView>
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: primaryColor,
    }
  });