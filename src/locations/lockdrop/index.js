import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import { LockersList } from '../../components'

export const Lockdrop = () => {

	return (
		<>
			<Flex
				flexDir='column'
				w='100%'
			>
				<Box as='h1'>Lockdrop</Box>
				<Box as='div' textStyle='subheading'>Earn for contributing to protocol liquidity.</Box>
				<LockersList/>
			</Flex>
		</>
	)
}