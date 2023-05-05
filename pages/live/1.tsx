import {
    Box,
    Flex,
    chakra,
    Avatar,
    Icon,
    Button,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {HiOutlineLocationMarker} from "react-icons/hi";
import {AddIcon} from "@chakra-ui/icons";
import {GetStaticProps} from "next";
import axios, {AxiosRequestConfig} from "axios";
import DirectionPlayer from "../../components/DirectionPlayer";
import HorizontalScroll from 'react-scroll-horizontal'
import {getAuth} from "@firebase/auth";
import useFirebase from "../../hooks/useFirebase";


export default function Live({data}) {
    const [directionIndex, setDirectionIndex] = useState(-1);
    const [voteIndex, setVoteIndex] = useState(-1);
    const {user} = useFirebase();
    useEffect(() => {
        if (user && data.directions) {
            (async () => {
                const token = await user.getIdToken();
                if (token) {
                    const ds = [];
                    data.directions.forEach(direction => {
                        ds.push(direction.id)
                    })
                    const postData = {
                        id: data.directions[0].liveId,
                        directions: ds,
                        token
                    };
                    const config: AxiosRequestConfig = {
                        method: "POST",
                        url: "https://us-central1-metalive-348103.cloudfunctions.net/voteCheck",
                        data: postData,
                    }
                    const res = await axios(config);
                    setVoteIndex(res.data.index)
                    console.log(res);
                    console.log(voteIndex)
                }
            })();
        }
    }, [user])

    return (
        <Flex p={16}>
            <chakra.div width={"xl"} height={"xl"} zIndex={1}>
                <DirectionPlayer direction={directionIndex == -1 ? {
                    liveId: "xSfcYiI8qpEqMI6ADGuy",
                    url: data.url,
                    equipments: data.equipments,
                    duration: 0
                } : data.directions[directionIndex]}/>
            </chakra.div>
            <Box px={8} w={'50%'}>
                <chakra.h1 fontWeight={"bold"} fontSize={"4xl"}>
                    {data?.title}
                </chakra.h1>
                <Flex align={"center"} my={2}>
                    <Avatar
                        zIndex={-1}
                        mr={2}
                        src={""}
                    />
                    <Flex flexDir={"column"}>
                        <chakra.text fontSize={"xl"}>Artist</chakra.text>
                        <chakra.text color={"gray.500"}>2023/01/01</chakra.text>
                    </Flex>
                </Flex>
                <chakra.h2 fontSize={"2xl"} mt={2} fontWeight={"900"}>
                    説明
                </chakra.h2>
                <chakra.text>{data.description}</chakra.text>
                <chakra.h2 fontSize={"2xl"} mt={8} fontWeight={"900"}>
                    ライブ日時
                </chakra.h2>
                <chakra.text>2023年1月5日</chakra.text>
                <chakra.h2 fontSize={"2xl"} mt={4} fontWeight={"900"}>
                    場所
                </chakra.h2>
                <Flex>
                    <Icon as={HiOutlineLocationMarker}/>
                    <chakra.text>〒102-8321 東京都千代田区北の丸公園2番3号</chakra.text>
                </Flex>
                <chakra.h2 mt={8} fontWeight={"900"} fontSize={"2xl"}>
                    演出
                </chakra.h2>
                <chakra.div my={6}>
                    <chakra.h3 fontSize={"xl"} fontWeight={"500"} my={2}>
                        PART1
                    </chakra.h3>
                    <HorizontalScroll style={{maxWidth: '60em', width: `${data.directions * 10 + 10}em`, height: 272}}
                                      reverseScroll>
                        {data.directions.map((direction, index) => {
                            return (
                                <chakra.div
                                    key={index}
                                    mr={8}
                                    width={'12em'}
                                    height={'16.9em'}
                                    boxShadow={"xl"}
                                    backgroundColor={"white"}
                                    borderWidth={index === directionIndex ? 2 : 0}
                                    borderColor={'red'}
                                >
                                    <Image
                                        width={400}
                                        height={264}
                                        objectFit="contain"
                                        onClick={() => {
                                            index == directionIndex ? setDirectionIndex(-1)
                                                : setDirectionIndex(index);
                                        }}
                                        src={
                                            "data:image/jpeg;base64,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"
                                        }
                                    />
                                    <chakra.div px={2}>
                                        <chakra.h4 fontSize={"2xl"} fontWeight={"500"}>
                                            {direction.title}
                                        </chakra.h4>
                                        <chakra.div my={0.5}>by Creator1 at 2023/01/01</chakra.div>
                                    </chakra.div>
                                    <Button borderRadius={0} flexDirection={'column'} w={"100%"} h={12}
                                            p={0}
                                            colorScheme={index === voteIndex ? 'red' : null}
                                            onClick={async () => {
                                                setVoteIndex(index);
                                                const token = await user.getIdToken();
                                                const data = {
                                                    direction,
                                                    token
                                                };
                                                const config: AxiosRequestConfig = {
                                                    method: "POST",
                                                    url: "https://us-central1-metalive-348103.cloudfunctions.net/directionVote",
                                                    data,
                                                }
                                                const res = await axios(config);
                                            }}>
                                        <chakra.text>投票する！</chakra.text>
                                        <chakra.text>
                                            {direction.voters.length}
                                        </chakra.text>
                                    </Button>
                                </chakra.div>)
                        })}
                        <Link href={"../edit"}>
                            <Flex
                                flexDir={"column"}
                                mr={4}
                                align={"center"}
                                justify={"center"}
                                backgroundColor={"white"}
                                p={2}
                            >
                                <AddIcon w={12} h={12}/>
                                <chakra.text mt={4} fontSize={"xl"}>
                                    投稿
                                </chakra.text>
                            </Flex>
                        </Link>
                    </HorizontalScroll>
                </chakra.div>
                <chakra.div my={6}>
                    <chakra.h3 fontSize={"xl"} fontWeight={"500"} my={2}>
                        PART2
                    </chakra.h3>
                    <Flex>
                        {/*<chakra.div*/}
                        {/*    mr={4}*/}
                        {/*    boxShadow={"xl"}*/}
                        {/*    backgroundColor={"white"}*/}
                        {/*    width={"3xs"}*/}
                        {/*>*/}
                        {/*    <Image*/}
                        {/*        width={400}*/}
                        {/*        height={264}*/}
                        {/*        src={*/}
                        {/*            "data:image/jpeg;base64,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"*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*    <chakra.div px={2}>*/}
                        {/*        <chakra.h4 fontSize={"2xl"} fontWeight={"500"}>*/}
                        {/*            テスト*/}
                        {/*        </chakra.h4>*/}
                        {/*        <chakra.div my={0.5}>by AlanWalker at 2023/01/01</chakra.div>*/}
                        {/*    </chakra.div>*/}
                        {/*    <Button w={"100%"} borderRadius={0}>*/}
                        {/*        <chakra.text>投票する！</chakra.text>*/}
                        {/*    </Button>*/}
                        {/*</chakra.div>*/}
                        <Link href={"../edit"}>
                            <Flex
                                flexDir={"column"}
                                mr={4}
                                align={"center"}
                                justify={"center"}
                                backgroundColor={"white"}
                                width={"3xs"}
                            >
                                <AddIcon w={12} h={12}/>
                                <chakra.text mt={4} fontSize={"xl"}>
                                    投稿
                                </chakra.text>
                            </Flex>
                        </Link>
                    </Flex>
                </chakra.div>
            </Box>
        </Flex>
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

