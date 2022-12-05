import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function apiClient() {

    // const [token, setToken] = useState("");
    // const [user, setUser] = useState("");
    // const navigate = useNavigate();
    
    // const getToken = () => {
    //     const tokenString = sessionStorage.getItem('token');
    //     const userToken = JSON.parse(tokenString);
    //     return userToken;
    // }

    // const getUser = () => {
    //     const userString = sessionStorage.getItem('user');
    //     const userInfo = JSON.parse(userString);
    //     return userInfo;
    // }

    // const saveToken = (user, token) => {
    //     sessionStorage.setItem('token', JSON.stringify(token));
    //     sessionStorage.setItem('user', JSON.stringify(user));
    //     setToken(token);
    //     setUser(user);
    //     navigate('/user');
    // }

    // const logout = () => {
    //     sessionStorage.clear();
    //     navigate('/');
    // }

    const API = axios.create({
        baseURL: 'http://127.0.0.1:9000/',
        headers: {
            // 'Authorization': 'Bearer ' + getToken(),
        }
    });
    return {
        // setToken: saveToken,
        // token,
        // user,
        // getToken,
        // getUser,
        // logout,
        API
    }
}
