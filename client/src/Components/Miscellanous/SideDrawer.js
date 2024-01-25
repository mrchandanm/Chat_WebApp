import { Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuList, Spinner, Text,  Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BiSearch } from "react-icons/bi";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileMode from './ProfileMode';
import {useNavigate} from 'react-router-dom'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvator/UserListItem';

const SideDrawer = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate=useNavigate();
    const {user, setSelectedChat,chats, setChats} =ChatState()
    const [search, setSearch]=useState("");
    const [searchResult, setSearchResult]=useState([]);
    const [loading, setLoading]=useState(false);
    const [loadingChat, setLoadingChat]=useState();


    const logoutHandler=()=>{
        localStorage.removeItem("userInfo");
        navigate("/");

    }

    const accessChat= async(userId)=>{
        try {
            setLoadingChat(true);
            const config={
                headers: {
                    "Content-type": "application/json",
                    Authorization:`Bearer ${user.token}`
                },
            };

            const {data}=await axios.post(`http://localhost:8080/api/chat/`,{userId}, config);
            if(!chats.find((c)=>c._id===data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            console.log(error);
            toast({
                title: 'Something went wrong',
                status: 'warning',
                duration: 6000,
                isClosable: true,
                position:"bottom-left",
              });
              setLoadingChat(false);
        }
    }

    const handleSearch=async()=>{
        if(!search){
            toast({
                title: 'Write something to seacrh',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position:"top-left",
              });
              return;
        }

        try {
            setLoading(true);
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                },
            };

            const {data}=await axios.get(`http://localhost:8080/api/user/get-user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            console.log(error);
            toast({
                title: 'Something went wrong',
                status: 'warning',
                duration: 6000,
                isClosable: true,
                position:"bottom-left",
              });
              setLoading(false);
        }
    }
  return (
    <>
      <Box
        style={{ display: "flex" }}
        d="flex"
        bg="white"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <BiSearch></BiSearch>
            <Text d={{ base: "none", md: "flex" }} px="3.5" mt="3">
              Search User
            </Text>{" "}
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="work-sans">
          IITP Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton><BellIcon/></MenuButton>
            {/* <MenuList>
              <MenuItem>Download</MenuItem>
            </MenuList> */}
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar size="sm" cursor='pointer' name={user.user.name} src={user.user.pic}/>
            </MenuButton>
            <MenuList>
                <ProfileMode user={user.user}>
                <MenuList as={Button}>My Profile</MenuList>
                </ProfileMode>
                <MenuDivider/>
                <MenuList as={Button} onClick={logoutHandler}>Logout</MenuList>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen}
        placement='left'
        onClose={onClose} >
            <DrawerOverlay/>
            <DrawerContent>
            <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>

          <DrawerBody>
           <Box style={{display:"flex", padding:'2px'}}>
            <Input placeholder='search user by name' value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
            <Button mx="2" onClick={handleSearch}>Go</Button>
           </Box>
           {loading?(
            <ChatLoading/>
           ):(
           searchResult?.map(user=>(
            <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
           ))
           )}

           {loadingChat && <Spinner ml="auto" style={{display:"flex"}} />}
          </DrawerBody>
            </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer
