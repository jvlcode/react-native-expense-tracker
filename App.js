import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import CategoryScreen from './screens/CategoryScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import { Provider, useSelector } from 'react-redux';
import { store } from './utils/store'
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from './screens/SettingsScreen';
import { getCurrentBudget } from './utils/helpers';
 
const Drawer = createDrawerNavigator();

export default function App() {
	
	useEffect(()=>{
	// AsyncStorage.clear()
	},[])
  	return  <>
			<Provider store={store}>
				<NavigationContainer >
					<DrawerNavigator/>
				</NavigationContainer>
			</Provider>
  	</>
	function DrawerNavigator() {
		const budgets = useSelector(state =>  state.budgets);
		const budget = getCurrentBudget(budgets);
		return (<Drawer.Navigator  initialRouteName="Home"  screenOptions={{headerShown: false, }}>
			<Drawer.Screen name="Settings" component={SettingsScreen} />
			<Drawer.Screen name="Home" component={HomeScreen} />
			<Drawer.Screen name="Categories" component={CategoryScreen} />
			{budget &&<Drawer.Screen name="Add Expense" component={AddExpenseScreen} />}
			{budget &&<Drawer.Screen name="Reports" component={ReportScreen} />}
		</Drawer.Navigator>)
	}
	
	
  	
}



