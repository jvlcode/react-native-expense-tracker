import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import PieChart from 'react-native-pie-chart'
import Button from '../components/Button';
import BaseScreen from '../components/BaseScreen';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect,useState } from 'react';
import { updateBudgets } from '../utils/store';
import { getCurrentBudget, } from '../utils/helpers';
import { globalStyle } from '../utils/GlobalStyle';


const name = "Home";


export default function HomeScreen ({navigation}) {
	
	const budgets = useSelector(state =>  state.budgets);
	const budget = getCurrentBudget(budgets);

	const [categoryExpenses, setCategoryExpenses] = useState([])
    const handleDrawer = () => {
		navigation.openDrawer();
	}
    const widthAndHeight = 200

	const openAddExpense = () => {
		navigation.navigate('Add Expense');
	}

	const openSettings = () => {
		navigation.navigate('Settings');
	}

	const dispatch = useDispatch()

	async function loadBudgets()  {
		try {
			let budgets = await AsyncStorage.getItem('budgets');
			budgets = JSON.parse(budgets);
			if (budgets.length > 0) {
				dispatch(updateBudgets(budgets))
			} 
		} catch (error) {
			console.log(error, 'errro')
		}
	}

	  // Call the function to clear AsyncStorage data

	const expensesByCategory = () => {
		const expensesMap = budget.expenses.reduce((acc, expense) => {
			const element = acc.find((el) => el.category.id == expense.category.id)
			if(!element) {
				acc.push({
					category:expense.category, 
					amount: parseInt(expense.amount),
				})
			}else {
				acc = acc.map((el) => {
					if(el.category.id == expense.category.id){
						el.amount += parseInt(expense.amount)
					}
					return el;
				})
			}
			return acc
		},[]);
		setCategoryExpenses(expensesMap)
	}
	 
	useEffect(() => {
		if(budget) {
			expensesByCategory();
		}else {
			loadBudgets();
		}
	},[budgets])



    return 	<BaseScreen name={name} navigation={navigation}>
			<ScrollView>
				<View style={styles.header}>
					<Text style={styles.title}>Expense Tracker</Text>
					<TouchableOpacity style={{padding:10}} onPress={handleDrawer} >
						<Feather name="menu" size={30} color="white" />
					</TouchableOpacity>
				</View>
				{budget && <>
					{<Text style={[styles.largeText,{color:(budget.balance > 0?"white":"red"), marginTop: 50}]}>${budget.balance}</Text>}
					<View style={styles.expenseReport}>
						<View>
							{categoryExpenses.length > 0 && <PieChart  widthAndHeight={widthAndHeight} series={categoryExpenses.map( el => el.amount)} sliceColor={categoryExpenses.map( el => el.category.color)} />}
							<View style={{marginTop:30}}>
								<Text style={{textAlign:"center"}}>Budget for this Month</Text>
								<Text style={[styles.largeText,{color:"black"}]}>${budget.income}</Text>
							</View>
						</View>
						<View>
							{categoryExpenses.map((el,index) => (
								<View key={index} style={styles.categoryExpense}>
									<FontAwesome name='circle' size={20} color={el.category.color}/>
									<Text style={{marginRight:10}}>{el.amount}</Text>
									<Text style={{fontWeight:"bold"}}>{el.category.name}</Text>
								</View>
							))}
						</View>
					</View>
				</> || <Text style={globalStyle.infoTextStyle}>Add Expenses to See Reports!</Text>}	
			</ScrollView>
			{budget ? <Button style={styles.addButton} text="Add Expense" onPress={openAddExpense}  />: <Button style={styles.addButton} text="Add Income" onPress={openSettings} />}
	</BaseScreen>
}
const styles = StyleSheet.create({
    header: {
      flexDirection:"row",
      justifyContent: "space-between",
      margin:10,
    },
    title: {
      color: "white",
      fontSize:25,
      fontWeight:"bold",
    },
    expenseReport: {
      backgroundColor: "white",
      margin: 20,
      borderRadius: 20,	
      flexDirection:"row",
      justifyContent: "space-around",
      padding: 20
    }
    ,
    categoryExpense:{
      flexDirection:"row",
      marginBottom: 10,
      marginHorizontal:5
    },
    largeText: {
      fontSize:40, 
      fontWeight:"bold", 
      textAlign:"center"
    },
	addButton: {
		marginHorizontal:100, 
		marginVertical:20
	}

  });