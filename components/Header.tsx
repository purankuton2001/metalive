import React, {useReducer} from "react";
import {
    Modal,
    Avatar,
    Box, Button,
    chakra, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader, PopoverTrigger, useDisclosure
} from "@chakra-ui/react";
import useFirebase from "../hooks/useFirebase";
import {getAuth, signOut} from "@firebase/auth";
import Link from "next/link";


export default function Header() {
    const {user, app} = useFirebase();
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <Box display={"flex"} flexDirection={'row'} justifyContent={'space-between'} w={"100%"} bg={"white"} px={4}
             alignItems={'center'} py={3} boxShadow={"md"} position={"fixed"} zIndex={10}
        >
            <chakra.div/>
            {user ? <chakra.div>
                    <Popover>
                        {//@ts-ignore
                            <PopoverTrigger>
                                <Avatar src={user?.photoURL}/>
                            </PopoverTrigger>}
                        <PopoverContent>
                            <PopoverArrow/>
                            <PopoverCloseButton/>
                            <PopoverHeader flexDirection={'row'} display={'flex'} alignItems={'center'}
                                           fontWeight={'semibold'}>
                                <Avatar src={user?.photoURL} mr={4}/>
                                <chakra.text fontSize={32}>{user?.displayName ? user?.displayName : 'test'}</chakra.text>
                            </PopoverHeader>
                            <PopoverBody>
                                <Button h={8} w={'100%'} bg={'white'} justifyContent={'left'} onClick={onOpen}>
                                    <chakra.text fontWeight={'medium'}>ログアウト</chakra.text>
                                </Button>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </chakra.div>
                : <Link href={"/login"}>
                    <Button>
                        ログイン/新規登録
                    </Button>
                </Link>
            }
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent justifySelf={'center'} alignSelf={'center'}>
                    <ModalHeader>ログアウトしますか？</ModalHeader>
                    <ModalCloseButton/>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost' onClick={async () => {
                            const auth = await getAuth(app);
                            await signOut(auth);
                            onClose();
                        }}>
                            ログアウト
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
