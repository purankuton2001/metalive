import React, {useContext, useState} from 'react';
import {Box, Button, Input} from "@chakra-ui/react";
import axios from "axios";
import {ActionTypes} from "../types/utils";
import {EditorContext} from "../context/EditorContext";

export default function DmxSetting() {
    const [ipAdress, setIpAdress] = useState("");
    const {dispatch} = useContext(EditorContext);
    return (
        <Box>
            <Input placeholder='IP Adress' value={ipAdress} onChange={(event) => {
                setIpAdress(event.target.value)
            }}></Input>
            <Button onClick={async () => {
                dispatch({type: ActionTypes.ADDUNIVERSE, payload: {ipAdress}})
            }}>
                接続
            </Button>
        </Box>
    )
}