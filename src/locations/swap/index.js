import React from 'react'
import { useWallet } from 'use-wallet'
import { Flex } from '@chakra-ui/react'
import { SwapBox } from '../../components'

export const Swap = () => {

	const wallet = useWallet()

	return (
		<>
			<Flex
				justifyContent='center'
			>
			</Flex>
		</>
	)
}