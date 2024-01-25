import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useNavigate,useLocation} from 'react-router-dom'

const Login = () => {
    const navigate=useNavigate(); // use to navigate from one page to another 
    const location=useLocation();
  
      const [show, setShow]=useState(false);
  
      const [loading, setLoading]=useState(false);
      const [email, setEmail]=useState("");
      const [password, setPassword]=useState("");
      const toast = useToast();
  
      const HandleonClick=()=>{
          setShow(!show);
      }
  
      const handleOnSubmit=async ()=>{
        setLoading(true);
        if( !email || !password ){
               
                toast({
                        title: 'All fields are required',
                        status: 'warning',
                        duration: 9000,
                        isClosable: true,
                      });
                      setLoading(false);
                      return;
        }
  
        try {
          const config={
            headers:{
                    "Content-type": "application/json"
            },
    }
    const {data}= await axios.post(`http://localhost:8080/api/user/login`,{email,password}, config);
  
    if( data.success){
      navigate('/chat');
      localStorage.setItem('userInfo',JSON.stringify(data))
      toast({
        title: 'login Successful',
        status: 'success',
        duration: 9000,
        isClosable: true,
    
      });
        
      setLoading(false);
    }
    else{
        toast.error(data.message);

        setLoading(false);
    }    
        } catch (error) {
          toast({
            title: 'Something went error',
            status: 'warning',
            duration: 9000,
            isClosable: true
        
          });
          console.log(error);
          setLoading(false);
        }
        setLoading(false);
      }


  return (
    <div>
        <VStack spacing='5px'>
   <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your Email' onChange={(e)=>{setEmail(e.target.value)}} value={email} color="black" bg="white" />
    </FormControl>

    <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup bg="white">
            <InputRightElement width="4.5rem">
            <Button onClick={HandleonClick}>{show?"hide":"show"}</Button>
            </InputRightElement>
            <Input type={show? 'text':'password'} placeholder='Enter your Password' onChange={(e)=>{setPassword(e.target.value)}} value={password} color="black" bg="white" />
            </InputGroup>
    </FormControl>

    <Button
            width="100%"
            style={{marginTop:"15px"}}
            onClick={handleOnSubmit}
            isLoading={loading}
            >
                Submit
            </Button>

            <Button
            width="100%"
            colorScheme='red'
            style={{marginTop:"15px"}}
            onClick={handleOnSubmit}
            >
               Login as Guest
            </Button>
    </VStack>
    </div>
  )
}

export default Login
