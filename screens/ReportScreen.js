import { ScrollView, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import BaseScreen from '../components/BaseScreen';
import { useDispatch, useSelector } from 'react-redux';
import {  FontAwesome } from '@expo/vector-icons';
import { globalStyle } from '../utils/GlobalStyle';
import moment from 'moment';
import { removeExpense } from '../utils/store';
import { getCurrentBudget } from '../utils/helpers';

const name = "Reports";

export default function ReportScreen ({navigation}) {
	const dispatch = useDispatch();
	const budgets = useSelector(state => state.budgets);
	const budget = getCurrentBudget(budgets);
	const today = moment().startOf('day');
    const startOfMonth = moment().startOf('month');

    const todayExpenses = budget && budget.expenses.filter(expense => moment(expense.date).isSame(today, 'day')) || [];
    const thisMonthExpenses = budget && budget.expenses.filter(expense => moment(expense.date).isSameOrAfter(startOfMonth))|| [];
	
	const handleDelete = (id,amount) => {
		dispatch(removeExpense({id,amount}))
	}

    return <BaseScreen name="Reports" navigation={navigation} backTo="Home">
		<ScrollView>
			{budget && thisMonthExpenses.length > 0 && <>
				{todayExpenses.length > 0 && <ExpenseList data={todayExpenses} name="Today" />}
				<ExpenseList data={thisMonthExpenses} name="This Month" />
			</> || <Text style={globalStyle.infoTextStyle}>No Reports to display</Text>}

		</ScrollView>
	</BaseScreen>

function ExpenseList({data,name}) {
	return <>
			<Text style={{fontWeight:"bold", marginHorizontal:40, marginBottom:10, color:"white"}}>{name}</Text>
			{
				data.map((expense, i) => (
					<Expense 
						key={i}
						category={expense.category.name} 
						amount={expense.amount} 
						iconColor={expense.category.color}
						date={moment(expense.date).format("ddd DD, MMM")}
						id={expense.id}
					/>))
			}
			</>
}
function Expense({amount, category, iconColor,date, id}) {
	return <View style={[globalStyle.card,{flexDirection:"row"}]}>
			<View style= {{flex:2}}>
				<Text style={[globalStyle.mediumText,{color: "red"}]}>-{amount}</Text>
				<View style={{flexDirection:"row"}}>
					<FontAwesome name="circle" size={15} color={iconColor} style={{marginRight:5}} />
					<Text style={{fontSize: 14, fontWeight:"bold"}}>{category}</Text>
				</View>
			</View>
			<View style= {{flex:2,}}>
				<Text style={globalStyle.mediumText}>{date}</Text>
			</View>
			<View style={globalStyle.cardAction}>
				<TouchableOpacity onPress={() => handleDelete(id,amount)} style={{padding:10}}>
					<FontAwesome name="close" size={24} color="black" />
				</TouchableOpacity>
			</View>
		</View>
}

}

