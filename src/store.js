import { createStore } from 'redux'

const reducer = (state, action) => {
    if (action.type === "USER_UPDATE") {
        return {
            ...state,
            user_update: action.user_update,
        }
    }

    return state
}

export default createStore(reducer,
    {
        user_update: false,
    })