import React, { useEffect } from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import {useNavigate} from 'react-router-dom'
import Login from '../Components/Auth/Login.js'
import Signup from '../Components/Auth/Signup.js'

const RegistrationAndLoginPage = () => {

    const navigate=useNavigate();

    //if user is already login then it goes to chat app
    useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem('userInfo'));
     if(userInfo){
      navigate('/chat');
    }
     },[navigate])
  return (
    <Container maxW='xl' centerContent>
    <Box  bg="white" d='flex' justifyContent="center" p={3} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
      <Text fontSize="4xl" fontFamily='work sans' color={'black'} bg="white">IITP Chat App</Text>
    </Box>

    <div className='card bg-light shadow' style={{width:"100%", background:"white"}}  >

    <Tabs variant='soft-rounded' bg='white' >
<TabList>
  <Tab width="50%">Login</Tab>
  <Tab width="50%">Signup</Tab>
</TabList>
<TabPanels bg="white">
  <TabPanel>
    <Login></Login>
  </TabPanel>
  <TabPanel>
    <Signup></Signup>
  </TabPanel>
</TabPanels>
</Tabs>
    </div>
  </Container>
  )
}

export default RegistrationAndLoginPage
