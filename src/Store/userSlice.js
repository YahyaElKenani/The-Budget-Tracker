import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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
            const account = state.accounts.find((acc) => acc.userID === state.currentUserData.id) || null;
            state.currentUserData.username = action.payload;
            if (account) { 
                account.userName = action.payload;
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map ((savedAcc) => savedAcc.userID === account.userID
                ? {...savedAcc, userName: action.payload}
                : savedAcc)
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts))
            }
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
            if (amount < 0) return;
    
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                // Update both account and currentUserData
                const newBudget = Number(account.budget) + Number(amount);
                account.budget = newBudget;
                state.currentUserData.budget = newBudget;
                
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, budget: newBudget }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
        },

        reduceFromBudget: (state, action) => {
            const { amount } = action.payload;
            if (amount < 0) return;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            if (account) {
                const newBudget = Number(account.budget) - Number(amount)
                account.budget = newBudget;
                state.currentUserData.budget = newBudget;
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, budget: newBudget }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
            
        },
        
        addToHistory: (state, action) => {
            const { item } = action.payload;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            
            if (account) {
                // Initialize histories if they don't exist
                if (!account.budgetHistory) {
                    account.budgetHistory = [];
                }
                
                // Add to both account history and current user history
                account.budgetHistory.push(item);
                state.currentUserData.transactionsHistory.push(item);
    
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, budgetHistory: account.budgetHistory }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
        },
        removeFromTransactions: (state, action) => {
            const { productID } = action.payload;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            
            if (account?.transactionsList) { 
                // Remove from both account and current user
                account.transactionsList = account.transactionsList.filter(
                    transaction => transaction.ProductID !== productID
                );
                state.currentUserData.transactionsList = state.currentUserData.transactionsList.filter(
                    transaction => transaction.ProductID !== productID
                );
    
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, transactionsList: account.transactionsList }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
        },
        deleteTransactionsHistory: (state) => { 
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            
            if (account) {
                // Clear all transaction-related data
                account.budgetHistory = [];
                account.numberOfTransactions = 0;
                account.transactionsConfirmed = 0;
                account.transactionsDeleted = 0;
                
                // Clear current user data
                state.currentUserData.numberOfTransactions = 0;
                state.currentUserData.transactionsConfirmed = 0;
                state.currentUserData.transactionsDeleted = 0;
                state.currentUserData.transactionsHistory = [];
    
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { 
                            ...savedAcc, 
                            budgetHistory: [],
                            numberOfTransactions: 0,
                            transactionsConfirmed: 0,
                            transactionsDeleted: 0
                          }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
        },
        transactionCreated: (state) => { 
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            
            if (account) {
                // Initialize if needed
                if (!account.numberOfTransactions || isNaN(account.numberOfTransactions)) {
                    account.numberOfTransactions = 0;
                }
                
                // Increment counters
                account.numberOfTransactions += 1;
                state.currentUserData.numberOfTransactions += 1;
    
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, numberOfTransactions: account.numberOfTransactions }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
        },
        transactionConfirmed: (state) => { 
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            
            if (account) {
                // Initialize if needed
                if (!account.transactionsConfirmed || isNaN(account.transactionsConfirmed)) {
                    account.transactionsConfirmed = 0;
                }
                
                // Increment counters
                account.transactionsConfirmed += 1;
                state.currentUserData.transactionsConfirmed += 1;
    
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, transactionsConfirmed: account.transactionsConfirmed }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
        },
        transactionDeleted: (state, action) => {
            const { type } = action.payload;
            const account = state.accounts.find(acc => acc.userID === state.currentUserData.id);
            
            if (account && type === 'delete') {
                // Initialize if needed
                if (!account.transactionsDeleted || isNaN(account.transactionsDeleted)) {
                    account.transactionsDeleted = 0;
                }
                
                // Increment counters
                account.transactionsDeleted += 1;
                state.currentUserData.transactionsDeleted += 1;
    
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, transactionsDeleted: account.transactionsDeleted }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
                
                toast.success('Transaction Deleted!');
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
                budget: Number(newAccount.budget),
                budgetLimit: newAccount.budgetLimit,
                transactionsList: [],
                transactionsHistory: [],
                numberOfTransactions: newAccount.numberOfTransactions,
                transactionsConfirmed: newAccount.transactionsConfirmed,
                transactionsDeleted: newAccount.transactionsDeleted,
            }
            localStorage.setItem('accounts', JSON.stringify([...state.accounts]));
        },
        addTransactionToAccount: (state, action) => { 
            const { transaction } = action.payload;
            const account = state.accounts.find(user => user.userID === state.currentUserData.id);
            
            if (account) { 
                // Initialize transactionsList if it doesn't exist
                if (!account.transactionsList) {
                    account.transactionsList = [];
                }
                // Add transaction to account and current user
                account.transactionsList.push(transaction);
                state.currentUserData.transactionsList.push(transaction);
    
                // Update localStorage
                const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
                const updatedAccounts = savedAccounts.map(savedAcc => 
                    savedAcc.userID === account.userID 
                        ? { ...savedAcc, transactionsList: account.transactionsList }
                        : savedAcc
                );
                localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
            }
        },
        setCurrentUser: (state, action) => { 
            const account = state.accounts.find(acc => acc.userID === action.payload);
            if (account) { 
                state.currentUserData = {
                    username: account.userName,
                    id: account.userID,
                    budget: account.budget || 0,
                    budgetLimit: account.budgetLimit || 0,
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
        },
        updateLimit: (state, action) => {
            const {type, amount} = action.payload;
            const account = state.accounts.find((acc) => acc.userID === state.currentUserData.id)
            if (!account) { 
                return;
            }
            if (type === 'update') {
                state.currentUserData.budgetLimit = amount;
                account.budgetLimit = amount;
            } else if (type === 'add') { 
                state.currentUserData.budgetLimit = Number(state.currentUserData.budgetLimit) + amount;
                account.budgetLimit = Number(account.budgetLimit) + amount;
            } else if (type === 'reduce') { 
                state.currentUserData.budgetLimit = Number(state.currentUserData.budgetLimit) - amount;
                account.budgetLimit -= Number(account.budgetLimit) - amount;
            }
            const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
            const updatedAccounts = savedAccounts.map(savedAcc => 
                savedAcc.userID === account.userID 
                    ? { ...savedAcc, budgetLimit: account.budgetLimit }
                    : savedAcc
                    )
                    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
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
    createNewAccounts,
    updateLimit
} = userSlice.actions;

export default userSlice.reducer;