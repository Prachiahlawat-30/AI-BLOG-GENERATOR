import axios from 'axios';

//======REGISTRATION=========

export const registerAPI = async (userData) => {
    const response = await axios.post('http://localhost:5000/api/v1/users/register', {
        email : userData?.email,
        username : userData?.username,
        password : userData?.password

    },
    {
        withCredentials: true
    }
);
    return response?.data;
}
//======LOGIN=========
export const loginAPI = async (userData) => {
    const response = await axios.post('http://localhost:5000/api/v1/users/login', {
        email : userData?.email,
        password : userData?.password
    },
    {
        withCredentials: true
    }
);
    return response?.data;
}

//======CHECK AUTH STATUS=========
export const checkUserAuthStatusAPI = async () => {
    const response = await axios.get('http://localhost:5000/api/v1/users/check', {
        withCredentials: true
    });
    return response?.data;
}

//======LOGOUT=========
export const logoutAPI = async () => {
    const response = await axios.post('http://localhost:5000/api/v1/users/logout', {}, {
        withCredentials: true
    });
    return response?.data;
}

//======USER PROFILE=========
export const getUserProfileAPI = async () => {
    const response = await axios.get('http://localhost:5000/api/v1/users/profile', {
        withCredentials: true
    });
    return response?.data;
}

