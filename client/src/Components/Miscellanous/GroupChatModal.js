import React, { useState } from 'react'
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvator/UserListItem'
import UserBadgeItem from '../UserAvator/UserBadgeItem'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatname]=useState();
    const [selectedUsers, setSelectedUsers]=useState([]);
    const [search, setSearch]=useState();
    const [searchResult, setSearchResult]=useState();
    const [loading,setLoading]=useState();

    const toast=useToast();


    const {user, chats, setChats}=ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
    
        setSelectedUsers([...selectedUsers, userToAdd]);
      };

    const handleSearch=async (query)=>{
        setSearch(query)
        if (!query) {
            return;
          }
          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };

            const {data}=await axios.get(`http://localhost:8080/api/user/get-user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
          } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
          }

    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
      };

    const handleSubmit=async()=>{
        if (!groupChatName || !selectedUsers) {
            toast({
              title: "Please fill all the feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }

          try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };

              const {data}= await axios.post(`http://localhost:8080/api/chat/group`,{
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
              },
              config);

              setChats([data, ...chats]);
              onClose();
              toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
          } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
          }
    }

  return (
    <><span onClick={onOpen}>{children}</span>
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader fontSize="35px" fontFamily="work-sans" justifyContent="center" style={{display:"flex"}}>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{display:"flex", flexDirection:"column"}} justifyContent="space-between" alignItems="center">
            <FormControl>
                <Input placeholder='write group name' mb={3} onChange={(e)=>setGroupChatname(e.target.value)}/>
            </FormControl>

            <FormControl>
                <Input placeholder='search user you want to add. eg. chandan' mb={3} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
