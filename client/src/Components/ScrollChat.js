import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import SederMessageUI from './Miscellanous/SederMessageUI';
import UserMessageUi from './Miscellanous/UserMessageUi';
import { ChatState } from '../Context/ChatProvider';

const ScrollChat = ({messages}) => {
    const { user } = ChatState();
  return (
    <ScrollableFeed>
        {messages.map((m)=>(
            (m.sender._id==user.user.id?<UserMessageUi m={m}/>: <SederMessageUI m={m} />)
        ))}
      
    </ScrollableFeed>
  )
}

export default ScrollChat
