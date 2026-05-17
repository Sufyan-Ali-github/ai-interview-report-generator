import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";


const Protected=({children})=>{
    const {authLoading,user}=useAuth();
   

    if(authLoading){
        return (
            <main>
                <h1>Checking Authentication...</h1>
            </main>
        )
    }
    


    if(!user ){
        // yahan check karna hai agr navigate direct use kyun kiya hai
        return <Navigate to={'/login'} />

    }


    return children;
}




export default Protected;

