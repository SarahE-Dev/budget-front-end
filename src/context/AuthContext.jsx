import { createContext, useReducer } from "react";


export const AuthContext = createContext({})
export const ExpenseContext = createContext({})
export const IncomeContext = createContext({})


const initialState = {
    user: null
}



const reducer = (state, action) => {
    switch(action.type){
        case "LOGIN": 
            return {
                user: {
                    email: action.user.email,
                    username: action.user.username,
                    id: action.user.id
                }
            }
        case 'LOGOUT':
            return {
                user: null
            }
    }
}

function AuthContextWrapper({children}) {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (<AuthContext.Provider value={{state, dispatch}}>
        {children}
    </AuthContext.Provider> )
}

export default AuthContextWrapper
