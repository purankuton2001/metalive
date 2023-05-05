import {
    getAuth,
    Auth,
    createUserWithEmailAndPassword,
    setPersistence,
    signInWithEmailAndPassword, browserLocalPersistence
} from "@firebase/auth";
import {chakra, Button} from "@chakra-ui/react";
import {Input} from '@chakra-ui/react'
import React, {useEffect, useState} from "react";
import useFirebase from "../hooks/useFirebase";
import {useRouter} from "next/router";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {app} = useFirebase();
    const router = useRouter();
    return (
        <chakra.div flexDirection={"column"} display={"flex"} alignItems={"center"}>
            <Input my={4} width={"50%"} value={email} onChange={e => setEmail(e.target.value)}/>
            <Input my={4} width={"50%"} value={password} onChange={e => setPassword(e.target.value)}/>
            <Button width={"50%"} onClick={async () => {
                try {
                    const auth = await getAuth(app);
                    await setPersistence(auth, browserLocalPersistence)
                    const user = await signInWithEmailAndPassword(auth, email, password);
                    router.push('/')
                } catch (err) {
                    console.log(err)
                }
            }}>
                ログイン
            </Button>
        </chakra.div>
    )
}

