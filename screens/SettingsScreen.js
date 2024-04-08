import {  StyleSheet,  TextInput, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyle, primaryColor } from '../utils/GlobalStyle';
import Tab from '../components/Tab';
import BackToHome from '../components/BackTo';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import {clearBudgets, updateBudget} from '../utils/store';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentBudget } from '../utils/helpers';
import BaseScreen from '../components/BaseScreen';
const moment = require('moment');


const name = "Settings";

export default function SettingsScreen ({navigation}) {
	const budgets = useSelector(state => state.budgets);
	const budget = getCurrentBudget(budgets);
	const [amount, setAmount] = useState(0);
	const dispatch = useDispatch()

	function updateIncome() {
		if (! amount > 0) {
			return ;
		}
		if(!budget) {
			const monthYear = moment().format('YYYY-MM');
			dispatch(updateBudget({
				monthYear,
				income: parseInt(amount), 
				balance: parseInt(amount),
				expenses: []
			}))
		}else {
			dispatch(updateBudget({
				...budget,
				income: parseInt(amount), 
			}))
		}
		navigation.navigate("Home")
	}


	useEffect(()=>{
		if(budget) {
			setAmount(budget.income)
		}
	},[budgets])

	const handleClear = () => {
		dispatch(clearBudgets());
		navigation.navigate("Home")
	}

    return <BaseScreen navigation={navigation} name={name} backTo="Home">
		<View style={{flex:1, justifyContent:"center", gap:10}}>
			<Text style={[globalStyle.mediumText, {color:"white", textAlign:"center"}]}>Income for this Month</Text>
			<View style={globalStyle.card}>
				<TextInput  keyboardType="numeric" value={amount.toString()} onChangeText={text => setAmount(text)} placeholder='$' style={{padding: 5, fontSize:50,  borderBottomWidth:3}} />
				<Button style={{marginTop:20}} onPress={updateIncome} text="Update"  />
			</View>
			<Button onPress={handleClear} style={styles.clearButton} text="Clear All" color="black" />
		</View>
	</BaseScreen>
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: primaryColor,
    },
	clearButton: {
		backgroundColor: "white",
		color:"black",
		marginHorizontal: 30,
		borderWidth: 3
	}
  });