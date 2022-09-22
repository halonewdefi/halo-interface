import React from 'react'
import { Flex, Box } from '@chakra-ui/react'

export const Hero = (props) => {

	return (
		<Flex
			flexDir='column'
			w='100%'
		>
			<Box as='h1'>OVERVIEW</Box>
			<Box as='div' textStyle='subheading'>Your performance across the protocol.</Box>
		</Flex>
	)
}
