import { createSlice } from "@reduxjs/toolkit";

const initState = {
    name: "", 
    accounts: [],
    currentUserData: { 
        username: '',
        id: '',
        budget: 0,
        transactionsList: [],
        transactionsHistory: [],
        numberOfTransactions: 0,
        transactionsConfirmed: 0,
        transactionsDeleted: 0
    },
};

const userSlice = createSlice({
    name: 'userData',
    initialState: initState,
    reducers: { 
        updateUsername: (state, action) => {
            const {userID, newName} = action.payload;
            const account = state.accounts.find((acc) => acc.id !== userID) || null;
            if (account) { 
                account.userName = newName;
            }
            state.currentUserData.username = newName;
        }, 
        updateBudget: (state, action) => { 
            const { amount } = action.payload;
            // state.currentUserData = { 
            //     ...state.currentUserData,
            //     budget: amount
            // }
            state.currentUserData.budget = amount
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                account.budget = amount;
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, budget: amount }
                        : savedAcc
                        )
                        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
                    }
        }, 
        addOnBudget: (state, action) => { 
            const { amount } = action.payload;
            state.currentUserData.budget += amount;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                account.budget += amount;
            }
            state.currentUserData.budget = account.budget;
        }, 

        reduceFromBudget: (state, action) => {
            const { amount } = action.payload;
            state.currentUserData.budget -= amount;
            console.log('Reducing budget by:', amount);
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                account.budget -= amount;
            }
            
            console.log('Updated budget:', state.currentUserData.budget);
        },
        
        addToHistory: (state, action) => {
            const { item } = action.payload;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                if (!account.budgetHistory) {
                    account.budgetHistory = [];
                }
                account.budgetHistory.push(item);
            }
            state.currentUserData.transactionsHistory.push(item);
        },
        removeFromTransactions: (state, action) => {
            const { productID } = action.payload;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account?.transactionsList) { 
                account.transactionsList = account.transactionsList.filter(
                    transaction => transaction.ProductID !== productID
                );
            }
            state.currentUserData.transactionsList = state.currentUserData.transactionsList.filter((transaction) => transaction.ProductID !== productID);
        },
        deleteTransactionsHistory: (state) => { 
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                account.budgetHistory = [];
                account.numberOfTransactions = 0;
                account.transactionsConfirmed = 0;
                account.transactionsDeleted = 0;
            }
            state.currentUserData.numberOfTransactions = 0
            state.currentUserData.transactionsConfirmed = 0
            state.currentUserData.transactionsDeleted = 0
            state.currentUserData.transactionsHistory = [];
        },
        transactionCreated: (state) => { 
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                if (!account.numberOfTransactions || isNaN(account.numberOfTransactions) || account.numberOfTransactions === null) {
                    account.numberOfTransactions = 0;
                } else { 
                    account.numberOfTransactions += 1;
                }
            }
            state.currentUserData.numberOfTransactions += 1;
        }, 
        transactionConfirmed: (state) => { 
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                if (!account.transactionsConfirmed || isNaN(account.transactionsConfirmed) || account.transactionsConfirmed === null) {
                    account.transactionsConfirmed = 0;
                }
                account.transactionsConfirmed += 1;
            }
            state.currentUserData.transactionsConfirmed += 1;
        }, 
        transactionDeleted: (state, action) => {
            const { type } = action.payload;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account && type === 'delete') {
                if (!account.transactionsDeleted || isNaN(account.transactionsDeleted)) {
                    account.transactionsDeleted = 0;
                }
                account.transactionsDeleted += 1;
                if (!state.currentUserData.transactionsDeleted) {
                    state.currentUserData.transactionsDeleted = 0;
                }
                state.currentUserData.transactionsDeleted += 1;
            }
        },
        addAccount: (state, action) => { 
            const newAccount = {
                ...action.payload,
                budgetHistory: [],
                numberOfTransactions: 0,
                transactionsConfirmed: 0,
                transactionsDeleted: 0,
                transactionsList: []
            };
            state.accounts.push(newAccount);
            state.currentUserData = { 
                username: newAccount.userName,
                id: newAccount.userID,
                budget: newAccount.userBudget,
                transactionsList: [],
                transactionsHistory: [],
            }
            localStorage.setItem('accounts', JSON.stringify(newAccount));
        },
        addTransactionToAccount: (state, action) => { 
            const { transaction } = action.payload;
            const account = state.accounts.find(user => user.userID === state.currentUserData.id);
            if (account) { 
                if (!account.transactionsList) {
                    account.transactionsList = [];
                }
                account.transactionsList.push(transaction);
            }
            state.currentUserData.transactionsList.push(transaction);
        },
        setCurrentUser: (state, action) => { 
            const account = state.accounts.find(acc => acc.userID === action.payload);
            if (account) { 
                state.currentUserData = {
                    username: account.userName,
                    id: account.userID,
                    budget: account.budget,
                    transactionsList: account.transactionsList || [],
                    transactionsHistory: account.budgetHistory || [],
                    numberOfTransactions: account.numberOfTransactions || 0,
                    transactionsConfirmed: account.transactionsConfirmed || 0,
                    transactionsDeleted: account.transactionsDeleted || 0
                };
            }
        }, 
        createNewAccounts : (state, action) => { 
            state.accounts = action.payload;
        }
    }
});

export const {
    updateUsername,
    updateBudget,
    addOnBudget,
    reduceFromBudget,
    addToHistory,
    removeFromTransactions,
    deleteTransactionsHistory,
    transactionCreated,
    transactionConfirmed,
    transactionDeleted,
    addAccount,
    addTransactionToAccount,
    clearTransactionsFromAccount,
    setCurrentUser,
    createNewAccounts
} = userSlice.actions;

export default userSlice.reducer;