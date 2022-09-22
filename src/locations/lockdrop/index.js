import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import { Hero, LockerList } from '../../components'

export const Lockdrop = () => {

	return (
		<>
			<Hero/>
			<Box
				layerStyle='hr'
				margin='0 auto 3rem auto'
				width='96%'
			/>
			<Flex
				flexDir='column'
				w='100%'
			>
				<Box as='h1'>Lockdrop</Box>
				<Box as='div' textStyle='subheading'>Earn for contributing to protocol liquidity.</Box>
				<LockerList/>
			</Flex>
		</>
	)
}