import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import BackToHome from '../components/BackTo';
import { TextInput } from 'react-native-gesture-handler';
import { useState, useRef, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {  FontAwesome } from '@expo/vector-icons';
import Button from '../components/Button';
import BaseScreen from '../components/BaseScreen';
import { addCategory,removeCategory, updateCategory , updateCategories} from '../utils/store'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentBudget } from '../utils/helpers';
import { globalStyle } from '../utils/GlobalStyle';


const name = "Categories";
export default function CategoryScreen ({navigation}) {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedColor, setSelectedColor] = useState("");
	const [loading, setLoading] = useState(true);
	const [editIndex, setEditIndex] = useState(-1);
	const [showModal, setShowModal] = useState(false);
	const categories  = useSelector((state) => state.categories)
	const budgets  = useSelector((state) => state.budgets)
	const budget  = getCurrentBudget(budgets);
	const textInputRef = useRef(null);
	const dispatch = useDispatch();
	
	
	const colors = [
		{name: "Red", color: "red"},
		{name: "Blue", color: "blue"},
		{name: "Green", color: "green"},
		{name: "Yellow", color: "yellow"},
		{name: "Orange", color: "orange"},
		{name: "Pink", color: "pink"},
		{name: "White", color: "white"},
		{name: "Black", color: "black"},
	]


	const closeModal = () =>{
		setSelectedColor("");
		setSelectedCategory("");
		setShowModal(false)
	}
	const openModal = () =>{
		setShowModal(true)
	}
	const addExpense = () =>{
		navigation.navigate("Add Expense")
	}
	const editCategory = (index) =>{
		setEditIndex(index);
		const editCategory = categories[index];
		setSelectedColor(editCategory.color);
		setSelectedCategory(editCategory.name);
		openModal()
	}
	const deleteCategory = async() =>{
		const editCategory = categories[editIndex];
		
		setEditIndex(-1);
		dispatch(removeCategory({id: editCategory.id}))
		closeModal()
	}
	
	const saveCategory = async() =>{
		if(!selectedCategory || !selectedColor) {
			return
		}
		console.log(selectedCategory,selectedColor)
		if(editIndex !== -1) {
			const editCategory = {...categories[editIndex]};
			editCategory.name = selectedCategory;
			editCategory.color = selectedColor;
			dispatch(updateCategory(editCategory));
			setEditIndex(-1);
		}else {
			 dispatch(addCategory({name: selectedCategory, color: selectedColor}));
			
		}
		closeModal();
	}

	async function loadCategories()  {
		try {
			
			let categories = await AsyncStorage.getItem('categories');
			if (categories !== null ) {
				categories = JSON.parse(categories);
			} else {
				
				categories = [{id:1, name: "Other", color: 'black'}];
				
			}
			dispatch(updateCategories(categories))
		} catch (error) {
			console.log(error, 'errro')
		}
	}

	

	useEffect(() => {
		if(loading) {
			loadCategories()
			setLoading(false)
		}
	},[categories])
    
    return  <BaseScreen navigation={navigation} name={name} backTo="Home">
		<Modal
			style={{backgroundColor:"red"}}
			onRequestClose={() => setShowModal(false)}
			animationType="slide"
			transparent={true}
			visible={showModal}>
				<View onPress={() => setShowModal(false)} style={styles.modal}>
					<View style={styles.modalContainer}>
						<TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)} >
							<FontAwesome name="close" size={24} color="black" />
						</TouchableOpacity>
						<View style={{ marginHorizontal:30 }}>
							<TextInput ref={textInputRef} onChangeText={(text) => setSelectedCategory(text)} placeholder='Category' value={selectedCategory}  style={{padding:10, borderBottomWidth:3, borderBottomColor: "black", fontSize:20 ,width:200}} />
							<Picker
								style={{backgroundColor:"lightgray", marginTop:15}}
								selectedValue={selectedColor}
								onValueChange={(itemValue, itemIndex) =>
									setSelectedColor(itemValue)
								}>
								<Picker.Item label="Select Color" value="" />
								{colors.map((el,index) => <Picker.Item  key={index} label={el.name} value={el.color} />)}
							</Picker>
						</View>
						<View style={styles.modalFooter}>
							<TouchableOpacity onPress={deleteCategory} >
								{ editIndex !== -1 && <Text style={[styles.modalButton, {backgroundColor: "red"}]}>Delete</Text>} 
							</TouchableOpacity>
							<TouchableOpacity onPress={saveCategory} >
								<Text style={[styles.modalButton]}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
		</Modal>
		<ScrollView >
				{categories.length > 0 && categories.map((category,index) => <Category index={index} key={index}  name={category.name} color={category.color} /> )
				 || <Text style={globalStyle.infoTextStyle}>Add Some Categories!{categories.toString()}</Text>
				}
		</ScrollView>
		{!showModal && 
				<Button style={[styles.buttonOverlay,{right:20}]} text="Add Category" onPress={openModal} />
		}
		{budget && <Button style={[styles.buttonOverlay, {left:20}]} text="Add Expense" onPress={addExpense} />}
	</BaseScreen>
	

	function Category({color,name,index}) {
		return <View style={[globalStyle.card,{flexDirection:"row"}]}>
			<FontAwesome name="circle" size={24} color={color} style={{marginRight:10}} />
			<View style= {{flex:2}}>
				<Text style={globalStyle.mediumText}>{name}</Text>
			</View>
			<View style={globalStyle.cardAction}>
				<TouchableOpacity onPress={() => editCategory(index)} style={{padding:10}}>
					<FontAwesome name="chevron-right" size={24} color="black" />
				</TouchableOpacity>
			</View>
		</View>
	}
}
const styles = StyleSheet.create({
	modal:{
		justifyContent:"center" ,  
		alignItems:"center", flex:1
	},
	modalContainer: {
		backgroundColor:"white",
		borderRadius:20, 
		borderWidth:2
	},
	closeButton: {
		alignItems:"flex-end" ,
		margin:15,
		padding:10
	},
	modalButton: {
		fontSize: 20, 
		fontWeight:"bold", 
		textAlign:"center",
		color:"white",
		backgroundColor:"black", padding:10, marginTop:20, borderRadius: 10
	},
	modalFooter: {
		flexDirection:"row",
		justifyContent:"space-around", 
		margin: 10
	},
	buttonOverlay: {
		position:"absolute", 
		zIndex:1,
		bottom:100, 
	}
  });