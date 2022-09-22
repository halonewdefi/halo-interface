import React from 'react'
import { Flex } from '@chakra-ui/react'
import { PhaseEndTimer } from '../PhaseEndTimer'

export const Hero = (props) => {

	return (
		<Flex
			{...props}
			flexDir='column'
			w='100%'
			p='1.222rem 0 2rem 0'
		>
			{/* <Box as='h1'>Insight</Box>
			<Box as='div' textStyle='subheading'>Stats & performance across the protocol.</Box> */}
			<PhaseEndTimer/>
		</Flex>
	)
}
