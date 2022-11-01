import React from 'react'
import { Flex } from '@chakra-ui/react'
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
				<LockerList/>
			</Flex>
		</>
	)
}