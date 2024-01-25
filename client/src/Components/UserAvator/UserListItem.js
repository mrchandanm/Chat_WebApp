import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({user, handleFunction}) => {

  return (
    <div>
      <Box  onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
     style={{display:"flex"}}
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      h="60px"
      borderRadius="lg">
   <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text mt="10px">{user.name}</Text>
        <Text mt="-10px" fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
      </Box>
    </div>
  )
}

export default UserListItem
