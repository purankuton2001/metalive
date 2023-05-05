import {
    Box,
    Flex,
    chakra,
    Avatar,
    Icon,
    Button, FormControl, FormErrorMessage, FormLabel, Input, Textarea,
} from "@chakra-ui/react";
import React, {useContext, useEffect, useReducer, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {HiOutlineLocationMarker} from "react-icons/hi";
import {AddIcon} from "@chakra-ui/icons";
import {GetStaticProps} from "next";
import axios, {AxiosRequestConfig} from "axios";
import DirectionPlayer from "./DirectionPlayer";
import HorizontalScroll from 'react-scroll-horizontal'
import useFirebase from "../hooks/useFirebase";
import {Field, Form, Formik} from "formik";
import {useRouter} from "next/router";
import {Direction} from "../types/lives";
import {EditorContext} from "../context/EditorContext";


export default function DirectionPost() {
    const router = useRouter();
    const {state, dispatch} = useContext(EditorContext);

    function validateTitle(value) {
        let error
        if (!value) {
            error = 'title is required'
        } else if (value.length < 3) {
            error = "title is too short"
        }
        return error
    }

    const {user} = useFirebase();

    return (
        <Box px={8} alignItems={'center'} w={'100%'}>
            <Formik
                initialValues={{title: '', description: ''}}
                onSubmit={(values, actions) => {
                    setTimeout(async () => {
                        try {
                            actions.setSubmitting(false)
                            state.equipments.forEach((equipment) => {
                                Object.keys(equipment.parmeter).forEach((par) => {
                                    delete equipment.parmeter[par]._gsap
                                })
                            });
                            const direction: Direction = {
                                equipments: state.equipments,
                                title: values.title,
                                description: values.description,
                                artist: user.uid,
                                duration: state.duration,
                                url: state.url,
                                liveId: state.liveId
                            };
                            const token = await user.getIdToken();
                            const data = {
                                direction,
                                token
                            };
                            const config: AxiosRequestConfig = {
                                method: "POST",
                                url: "https://us-central1-metalive-348103.cloudfunctions.net/directionPost",
                                data,
                            }
                            const res = await axios(config);
                            alert("投稿が完了しました！")
                            router.push('/');
                        } catch (error) {
                            alert(error.error);
                        }
                    }, 1000)
                }}
            >
                {(props) => (
                    <Form>
                        <Field name='title' validate={validateTitle}>
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.title && form.touched.title}>
                                    <FormLabel>Title</FormLabel>
                                    <Input {...field} placeholder='title'/>
                                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='description'>
                            {({field, form}) => (
                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea {...field} placeholder='description'/>
                                </FormControl>
                            )}
                        </Field>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                            投稿
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get(
        `https://us-central1-metalive-348103.cloudfunctions.net/liveFetch`, {
            params: {id: "xSfcYiI8qpEqMI6ADGuy"}
        });
    const data = res.data;

    if (!data) {
        return {
            notFound: true,
        };
    }

    return {
        props: {data},
    };
};

