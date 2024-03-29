import {useState,useEffect,createContext, useContext} from 'react'
// import {useNavigate} from 'react-router-dom'
const ChatContext=createContext();

const ChatProvider=({children})=>{
    const [user,setUser]=useState();
    const [selectedChat, setSelectedChat]=useState();
    const [chats, setChats]=useState([]);
    // const navigate=useNavigate();
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem('userInfo'));
    
        setUser(userInfo);
       
    },[])



    return(
        <ChatContext.Provider value={{user,setUser,selectedChat, setSelectedChat,chats, setChats}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState=()=>{        
    return useContext(ChatContext); // we can also use from main page {user}=useContext(ChatContext)  
}

export default ChatProvider;