import { createStore } from 'redux'
import SocketIOClient from 'socket.io-client';

const reducer = (state, action) => {
    if (action.type === "USER_UPDATE") {
        return {
            ...state,
            user_update: action.user_update,
        }
    }
    if (action.type === "POST_COMMENTED") {
        return {
            ...state,
            id_post_commented: action.id_post_commented,
        }
    }

    return state
}

export default createStore(reducer,
    {
        user_update: false,
        id_post_commented:null,
        // socket:SocketIOClient('https://gn8socket.herokuapp.com')
        socket:SocketIOClient('http://localhost:8080')
    })