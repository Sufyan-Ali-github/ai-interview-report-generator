import { client } from "../../../api/client.js"


export const loginUser = async (credentials) => {
    try {
        const response = await client.post("/auth/login", credentials);
        return  response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const registerUser = async (userData) => {   
    try {
        const response = await client.post("/auth/register", userData);
        return  response.data;
    } catch (error) {
        throw error.response.data;
    }
} 

export const logoutUser = async () => {
    try {
        const response = await client.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getUser = async ()=>{
    try{
        const response=await client.get("/auth/get-user");
        return  response.data;
    }catch(error){
        throw error.response.data;
    } 
}