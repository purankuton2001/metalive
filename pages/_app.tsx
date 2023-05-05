import {ChakraProvider, chakra, Box} from "@chakra-ui/react";

import '../firebase';
import React, {useEffect} from 'react';
import {getAuth, onAuthStateChanged} from "@firebase/auth";
import useFirebase from "../hooks/useFirebase";
import Header from "../components/Header";


function MyApp({Component, pageProps}) {
    return (
        <ChakraProvider>
            <Header/>
            <Box py={16}>
                <Component {...pageProps} />
            </Box>
        </ChakraProvider>
    );
}

export default MyApp;
