import { Entypo } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { primaryColor } from '../utils/GlobalStyle';
import { getCurrentBudget } from '../utils/helpers';
import {useSelector} from "react-redux";

export default function Tab({navigation,activeScreen}) {
    const budgets = useSelector(state =>  state.budgets);
	const budget = getCurrentBudget(budgets);
    const handleNavigation = (name) => {
		navigation.navigate(name);
	}
    return  <View style={styles.bottomNav}>
                <Menu name="Home" icon="home" />
                {budget &&<Menu name="Reports" icon="pie-chart" />}
                <Menu name="Categories" icon="plus" />
            </View>
          

    function Menu({name,icon}) {
        return  <TouchableOpacity onPress={() => handleNavigation(name)}>
            <Entypo name={icon} size={40} color={activeScreen == name ?primaryColor:"black"} />
        </TouchableOpacity>
    }
}
const styles = StyleSheet.create({
	bottomNav: {
		backgroundColor:"white",
		padding:20,
		marginBottom: 10,
		borderRadius:50, 
		flexDirection:"row", 
		justifyContent:"space-around",
        shadowColor: 'black', // Add shadow properties for iOS shadow
        shadowOffset: {
          width: 0,
          height: 10,
        },
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 5,
	}

});
