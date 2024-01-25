import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import React from 'react'

const ProfileMode = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {children?(<span onClick={onOpen}>{children}</span>):(<IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}></IconButton>)}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="400px">
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{display:"flex", flexDirection:"column"}} justifyContent="space-between" alignItems="center">
          <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name}/>

          <Text fontSize={{base:"28px", md:"30px"}} >
            Email:{user.email}
          </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileMode
