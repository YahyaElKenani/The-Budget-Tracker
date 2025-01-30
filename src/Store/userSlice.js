import { createSlice } from "@reduxjs/toolkit";

const initState = {name: "", budget: 0, budgetHistory: [], currentTransactions: [], numberOfTransactions: 0, transactionsConfirmed: 0, transactionsDeleted: 0}
const userSlice = createSlice({
    name: 'userData',
    initialState: initState,
    reducers: { 
        updateUsername: (state, action) => {
            state.name = action.payload
        }, 
        updateBudget: (state, action) => { 
            state.budget = action.payload
        }, 
        addOnBudget: (state, action) => { 
            state.budget += action.payload
        }, 
        reduceFromBudget: (state, action) => {
            state.budget -= action.payload
        },
        addToHistory: (state, action) => {
            state.budgetHistory = [...state.budgetHistory, action.payload]
        },
        addToTransactions: (state, action) => { 
            state.currentTransactions = [...state.currentTransactions, action.payload]
        }, 
        removeFromTransactions: (state, action) => {
            state.currentTransactions = state.currentTransactions.filter((transaction) => transaction.ProductID !== action.payload)
        },
        deleteTransactionsHistory: (state) => { 
            state.budgetHistory = [];
            state.numberOfTransactions = 0;
            state.transactionsConfirmed = 0;
            state.transactionsDeleted = 0;
        },
        transactionCreated: (state) => { 
            state.numberOfTransactions += 1
        }, 
        transactionConfirmed: (state) => { 
            state.transactionsConfirmed += 1
        }, 
        transactionDeleted: (state, action) => {
            if (state.transactionsDeleted === 0) { 
                state.transactionsDeleted = 1
            }
            state.transactionsDeleted = state.transactionsDeleted + action.payload;
        }, 
    }
})

export const {updateUsername,
        updateBudget,
        addOnBudget,
        reduceFromBudget,
        addToHistory,
        addToTransactions,
        removeFromTransactions,
        deleteTransactionsHistory,
        transactionCreated,
        transactionConfirmed,
        transactionDeleted } = userSlice.actions
export default userSlice.reducer