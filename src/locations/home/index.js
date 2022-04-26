import React from 'react'
import { useWallet } from 'use-wallet'
import { Flex, Heading } from '@chakra-ui/react'

export const Home = () => {

	const wallet = useWallet()

	return (
		<>
			<Flex>
				<Heading as='h1'>Lockdrop</Heading>
			</Flex>
		</>
	)
}