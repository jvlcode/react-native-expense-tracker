import {  StyleSheet,  TextInput, View, Platform } from 'react-native';
import { globalStyle } from '../utils/GlobalStyle';
import BackToHome from '../components/BackTo';
import { Picker } from '@react-native-picker/picker';
import {  useState } from 'react';
import Button from '../components/Button';
import {addExpense} from '../utils/store';
import { useDispatch, useSelector } from 'react-redux';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import BaseScreen from '../components/BaseScreen';

const name = "Add Expense";

export default function AddExpenseScreen ({navigation}) {
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState({id:1, name: "Other", color: 'black'});
	const [date, setDate] = useState(new Date());
	const [datepicker, setDatepicker] = useState(false);
	const categories  = useSelector((state) => state.categories);
	const dispatch = useDispatch()

	const add = async() =>{
		if(!amount) {
			return
		}
		let selectedCategory = category
		if(!selectedCategory) {
			selectedCategory = {id:1, name: "Other", color: 'black'};
		}
		dispatch(addExpense({ category: selectedCategory, amount, date: date.toISOString()}));
		setAmount("");
		navigation.navigate("Home")
	}

	const onDateChange = (event, selectedDate) => {
		if (event.type === 'dismissed') {
		  	setDatepicker(false); // If picker is dismissed or cancelled, hide it
		} else {
			const currentDate = selectedDate || date;
			setDatepicker(Platform.OS === 'ios');
			setDate(currentDate);
			// Handle date selection here as needed
		}
	};


    return <BaseScreen navigation={navigation} name={name}>
        <BackToHome name={name} navigation={navigation} to="Home"/>
		<View style={styles.container}>
			<View style={globalStyle.card}>
				<TextInput keyboardType="numeric" value={amount} onChangeText={text => setAmount(text)} placeholder='$' style={{padding: 5, fontSize:50, borderBottomWidth:3}} />
				<Picker
					style={{backgroundColor:"lightgray", marginTop:15}}
					selectedValue={category}
					onValueChange={(itemValue, itemIndex) =>
						setCategory(itemValue)
					}
					>
					<Picker.Item label="Select Category" value="" />
					{categories.map((el,index) => <Picker.Item  key={index} label={el.name} value={el} />)}
				</Picker>
				{datepicker && <RNDateTimePicker mode='date' onChange={onDateChange} value={new Date()}   maximumDate={new Date()}/>}
				<Button text="Select Date" onPress={() => setDatepicker(true)} color="black" style={{backgroundColor:"white", borderWidth:3, color:"black", marginTop:20}} />
				<Button style={{marginTop:20}} onPress={add} text="Add"  />
			</View>
		</View>
  
	</BaseScreen>
}
const styles = StyleSheet.create({
    container : {
		flex:1, 
		justifyContent:"center"
	}
  });