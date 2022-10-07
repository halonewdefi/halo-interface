import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import {
	PhaseEndTimer,
	AccountOverview,
	LockerList,
	Divider,
} from '../../components'

export const Lockdrop = () => {

	return (
		<>
			<PhaseEndTimer/>
			<Divider/>
			<AccountOverview/>
			<Divider hidden={true}/>
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