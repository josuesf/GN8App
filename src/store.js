import { createStore } from 'redux'
import SocketIOClient from 'socket.io-client';

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
        // socket:SocketIOClient('https://gn8socket.herokuapp.com')
        socket:SocketIOClient('http://localhost:8080')
    })