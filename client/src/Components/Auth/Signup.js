import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useNavigate,useLocation} from 'react-router-dom'

const Signup = () => {
    const navigate=useNavigate(); // use to navigate from one page to another 
    const location=useLocation();

const [show, setShow]=useState(false);
const [loading, setLoading]=useState(false);


const [name, setName]=useState("");
const [email, setEmail]=useState("");
const [password, setPassword]=useState("");
const [confirmPassword, setConfirmPassword]=useState("");
//     const [pic, setPic]=useState("");


const toast = useToast()



const HandleonClick=()=>{
    setShow(!show);
}

const handleOnSubmit= async ()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmPassword){
           
            toast({
                    title: 'All fields are required',
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
                  });
                  setLoading(false);
                  return;
    }

    if(password!==confirmPassword){
            toast({
                    title: 'passwords do not match',
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
            const {data}= await axios.post(`http://localhost:8080/api/user/register`,{name,email,password}, config)

            navigate(location.state || '/chat');
            toast({
                    title: 'Registration Successful',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,

                  });

                  localStorage.setItem("userInfo", JSON.stringify(data));
                  setLoading(false);
            
    } catch (error) {
            toast({
                    title: 'Something went rong',
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
            
                  });  
                  setLoading(false)
    }

    
}
const postDetails=(pics)=>{

}

return (
<VStack spacing='5px' color="black" >
<FormControl id='name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter your name' onChange={(e)=>{setName(e.target.value)}} value={name} color="black" bg="white" />
</FormControl>

<FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your Email' onChange={(e)=>{setEmail(e.target.value)}} value={email} color="black" bg="white" />
</FormControl>

<FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup bg="white">
        <InputRightElement width="4.5rem">
        <Button onClick={HandleonClick}>{show?"Hide":"Show"}</Button>
        </InputRightElement>
        <Input type={show? 'text':'password'} placeholder='Enter your Password' onChange={(e)=>{setPassword(e.target.value)}} value={password} color="black" bg="white" />
        </InputGroup>
</FormControl>

<FormControl id='confirmPassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup >
        <InputRightElement width="4.5rem">
        <Button onClick={HandleonClick}>{show?"Hide":"Show"}</Button>
        </InputRightElement>
        <Input type={show? 'text':'password'} placeholder='Confirm Password' onChange={(e)=>{setConfirmPassword(e.target.value)}} value={confirmPassword} color="black" bg="white" />
        </InputGroup>


        <FormControl id='pic' isRequired>
        <FormLabel>Upload profile pic</FormLabel>
        <Input p={1.5} type="file" accept='image*/' onChange={(e)=>{postDetails(e.target.files[0])}} color="black" bg="white" />
</FormControl>


        <Button
        width="100%"
        style={{marginTop:"15px"}}
        onClick={handleOnSubmit}
        isLoading={loading}
        >
            Submit
        </Button>
</FormControl>



</VStack>
)
}

export default Signup
