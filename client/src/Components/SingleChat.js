import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender } from '../Config/ChatLogics';
import ProfileMode from './Miscellanous/ProfileMode';
import UpdateGroupChatModel from './Miscellanous/UpdateGroupChatModel';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import ScrollChat from './ScrollChat';
import io from "socket.io-client"
import   Lottie from "react-lottie";
import animationData from "./animations/typing.json"

const ENDPOINT='http://localhost:8080';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) =>{

  const [socketConnected, setSocketConnected] = useState(false);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
   
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
 

    useEffect(()=>{
      socket=io(ENDPOINT);
      // we are sending data from frontend using emit and
      socket.emit("setup",user.user);
      // and we are receiving data form backend using on

       socket.on("connection",setSocketConnected(true));
       socket.on("typing",()=>setIsTyping(true));
       socket.on("stop typing",()=>setIsTyping(false));


    },[])
    
  const fetchMessages=async()=>{
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const {data}= await axios.get(`http://localhost:8080/api/message/get-messages/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      // we are passing id to join a room with the selected user
      socket.emit("join-chat", selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
  },[selectedChat])

  useEffect(()=>{
    socket.on("message received", (newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id){
        //give notification
        console.log("snedikjc");
      }
      else{
        setMessages([...messages,newMessageReceived])
        console.log("receiverd");
      }
    })
  })

    const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage) {
        socket.emit("stop typing", selectedChat._id)
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          const {data}= await axios.post("http://localhost:8080/api/message/send", {content:newMessage,chatId:selectedChat._id}, config);

          socket.emit("new message", data );
          setMessages([...messages,data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    };
   

   

    const typingHandler=(e)=>{
      setNewMessage(e.target.value);
      if(!socketConnected) return;

      if(!typing){
        setTyping(true);
        socket.emit("typing", selectedChat._id)
      }

      let lastTypingTime=new Date().getTime();
      var timerLength=3000;
      setTimeout(()=>{
        var timeNow=new Date().getTime();
        var timeDiff = timeNow -lastTypingTime;

        if(timeDiff>= timerLength && typing){
          socket.emit('stop typing', selectedChat._id);
          setTyping(false);
        }
      }, timerLength)

    }

  return (
    <>
      {selectedChat?(
       <>
       <Text   fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
           style={{display:"flex"}}
            justifyContent={{ base: "space-between" }}
            alignItems="center">
                 <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat?
            (
            <>{ getSender(user,selectedChat.users).name}
            <ProfileMode user={ getSender(user,selectedChat.users)}></ProfileMode>
            </>
            ):(
                <>
                {selectedChat.chatName}
                <UpdateGroupChatModel 
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}/>
                </>
            )}
       </Text>

       <Box    style={{display:"flex"}}
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">

             {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div style={{display:"flex", flexDirection:"column", overflowY:"scroll", scrollbarWidth:"none"}}>
                <ScrollableChat messages={messages} />
                
              </div>
            )}

            <FormControl onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}>
                {istyping?<div> <Lottie options={defaultOptions} width={70} style={{ marginBottom:15,marginLeft:0}} /></div>:(<></>)}
               <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
       </Box>
       </>
      ):(
  <Box style={{display:"flex"}} alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
