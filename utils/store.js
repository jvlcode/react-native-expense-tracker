import { createSlice, configureStore } from '@reduxjs/toolkit'
import loggerMiddleware from '../middlwares/loggingMiddleware';
import { getCurrentBudget } from './helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';


const categoriesSlice = createSlice({
    name: 'categories',
    initialState: [],
    reducers: {
        updateCategories:(state,action) => {
            return [...action.payload]
        },
        addCategory:(state,action) => {
            let id = 1;
            if( state.length > 0){
                const lastElement = state[state.length - 1];
                id = lastElement.id+1;
            }
            const newCategory = {...action.payload,id}
            state.push(newCategory)
            AsyncStorage.setItem("categories",JSON.stringify(state))
            return state;
        },
        updateCategory:(state,action) => {
            state = state.map((category,index) => {
				if(category.id == action.payload.id) {
					category.color = action.payload.color;
					category.name = action.payload.name;
				}
				return category
			})
            AsyncStorage.setItem("categories",JSON.stringify(state))
        },
        removeCategory: (state,action) => {
            const updatedCategories = state.filter((category,i) => {
                if(category.id !== action.payload.id) {
                    return category
                }
            })
            AsyncStorage.setItem("categories",JSON.stringify(state))
            return updatedCategories;
        }
    }
})

const budgetsSlice = createSlice({
    name: 'budgets',
    initialState: [],
    reducers: {
        clearBudgets:(state, action) => {
            AsyncStorage.setItem("budgets",JSON.stringify([]))
            return [];
        },
        updateBudget: (state,action) => {
            const exists = state.some((el) => (action.payload.monthYear == el.monthYear))
            if (exists) {
                state = state.map((el) => {
                    if(action.payload.monthYear == el.monthYear) {
                        el.income = action.payload.income
                        const expenseTotal = el.expenses.reduce((acc,expense) => {
                          return acc + parseInt(expense.amount)
                        },0);
                        el.balance = el.income - parseInt(expenseTotal);
                    }
                    return el;
                })
            }else {
                state.push(action.payload)
            }
            AsyncStorage.setItem("budgets",JSON.stringify(state))
        } ,
        updateBudgets: (state,action) => {
           return [...action.payload]
        } ,
        addExpense: (state,action) => {
            const budget = getCurrentBudget(state)
            let id = 1;
            if( budget.expenses.length > 0){
                const lastElement = budget.expenses[budget.expenses.length - 1];
                id = lastElement.id + 1;
            }
            const newExpense = action.payload
            newExpense.id = id;
            budget.expenses.push(newExpense)
            budget.balance = budget.balance - parseInt(newExpense.amount);
            state = state.map((el) => {
                if(budget.monthYear == el.monthYear) {
                    return budget;
                }
                return el;
            })
            AsyncStorage.setItem("budgets",JSON.stringify(state))
        },
        removeExpense:  (state,action) => {
            const budget = getCurrentBudget(state)
            budget.expenses = budget.expenses.filter((expense,i) => {
                if(expense.id !== action.payload.id) {
                    return expense
                }
            })
            budget.balance = budget.balance + parseInt(action.payload.amount);
            state = state.map((el) => {
                if(budget.monthYear == el.monthYear) {
                    return budget;
                }
                return el;
            })
            AsyncStorage.setItem("budgets",JSON.stringify(state))
        }
    }
})


export const store = configureStore({
  reducer: {
    categories: categoriesSlice.reducer,
    budgets: budgetsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(loggerMiddleware),
})



export const { addCategory, updateCategory, removeCategory,updateCategories } = categoriesSlice.actions;
export const { addExpense, removeExpense, updateBudget, addBudget, updateBudgets, clearBudgets } = budgetsSlice.actions;