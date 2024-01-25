import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import MyChat from '../Components/MyChat'
import ChatBox from '../Components/ChatBox'
import SideDrawer from '../Components/Miscellanous/SideDrawer'
import { Box } from '@chakra-ui/react'


const HomePage = () => {
  const {user} =ChatState()
  const [fetchAgain, setFetchAgain]=useState();
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
     <Box style={{display:"flex"}} justifyContent='space-between' w="100%" h='91.5vh' p="10">
      {user && <MyChat fetchAgain={fetchAgain}/>}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
     </Box>
    </div>
  )
}

export default HomePage
