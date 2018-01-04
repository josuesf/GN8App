import { createStore } from 'redux'
import SocketIOClient from 'socket.io-client';
import { URL_WS_SOCKET } from './Constantes';
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
    if (action.type === "SET_USER") {
        return {
            ...state,
            id: action.id,
            correo: action.correo,
            nombre: action.nombre,
            usuario: action.usuario,
            password: action.password,
            photoUrl: action.photoUrl
        }
    }

    return state
}
export default createStore(reducer,
    {
        user_update: false,
        id_post_commented: null,
        socket:SocketIOClient(URL_WS_SOCKET),
        //socket:SocketIOClient('http://localhost:8080'),
        id: null,
        correo: null,
        nombre: null,
        usuario: null,
        password: null,
        photoUrl: null,
    })