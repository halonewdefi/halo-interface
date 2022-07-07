import React, { useState } from 'react'
import { TokenJazzicon } from '../../components'
import { Flex, InputGroup, Input, InputRightAddon, Box, Image, Button } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'
import { defaults } from '../../common'

export const SwapBox = (props) => {

	const [value0, setValue0] = useState(0)
	const [value1, setValue1] = useState(0)
	const [inputAmount0, setInputAmount0] = useState('')
	const [inputAmount1, setInputAmount1] = useState('')
	const [token0] = useState(defaults.ether)
	const [token1] = useState('')

	console.log(value0)
	console.log(value1)

	return (
		<Flex
			flexDir='column'
			gridGap='0.7rem'
			width='100%'
			maxW='400px'
		>
			<Flex
				layerStyle='opaque'
				p='0.7rem 1.13rem'
			>
				<InputGroup>
					<Input
						variant='transparent'
						flex='1'
						fontSize='1.3rem'
						fontWeight='bold'
						placeholder='0.0'
						size='lg'
						value={inputAmount0}
						onChange={(e) => {
							if (isNaN(e.target.value)) {
								setInputAmount0(prev => prev)
							}
							else {
								setInputAmount0(String(e.target.value))
								if(Number(e.target.value) > 0) {
									try {
										setValue0(ethers.utils.parseUnits(String(e.target.value), token0.decimals))
									}
									catch(err) {
										if (err.code === 'NUMERIC_FAULT') {
											console.log('num fault')
										}
									}
								}
							}
						}}/>
					{token0 &&
						<InputRightAddon
							width='auto'
							alignSelf='center'
							borderTopLeftRadius='1rem'
							borderBottomLeftRadius='1rem'
							borderTopRightRadius='1rem'
							borderBottomRightRadius='1rem'
							paddingInlineStart='0.9rem'
							paddingInlineEnd='0.9rem'
							cursor='pointer'
							as='button'
						>
							<Flex
								zIndex='1'
							>
								<Box d='flex' alignItems='center'>
									{token0 && token0?.logoURI &&
										<Image
											width='24px'
											height='24px'
											borderRadius='50%'
											mr='5px'
											src={token0?.logoURI}
											alt={`${token0?.name} token`}
										/>
									}
									{token0?.address && !token0?.logoURI &&
										<TokenJazzicon address={token0.address} />
									}
									<Box
										as='h3'
										m='0'
										fontSize='1.02rem'
										fontWeight='bold'
										textTransform='capitalize'>
										{token0?.symbol}
									</Box>
									<ChevronDownIcon
										height='1.2rem'
										transform='scale(1.2)'
									/>
								</Box>
							</Flex>
						</InputRightAddon>
					}
				</InputGroup>
			</Flex>
			<Flex
				layerStyle='opaque'
				p='0.7rem 1.13rem'
			>
				<InputGroup>
					<Input
						variant='transparent'
						flex='1'
						fontSize='1.3rem'
						fontWeight='bold'
						placeholder='0.0'
						size='lg'
						value={inputAmount1}
						onChange={(e) => {
							if (isNaN(e.target.value)) {
								setInputAmount1(prev => prev)
							}
							else {
								setInputAmount1(String(e.target.value))
								if(Number(e.target.value) > 0) {
									try {
										setValue1(ethers.utils.parseUnits(String(e.target.value), token1.decimals))
									}
									catch(err) {
										if (err.code === 'NUMERIC_FAULT') {
											console.log('num fault')
										}
									}
								}
							}
						}}/>
					{token1 &&
						<InputRightAddon
							width='auto'
							alignSelf='center'
							borderTopLeftRadius='0.375rem'
							borderBottomLeftRadius='0.375rem'
							paddingInlineStart='0.5rem'
							paddingInlineEnd='0.5rem'
						>
							<Flex
								cursor='default'
								zIndex='1'
							>
								<Box d='flex' alignItems='center'>
									{token1 && token1?.logoURI &&
										<Image
											width='24px'
											height='24px'
											borderRadius='50%'
											mr='5px'
											src={token1?.logoURI}
											alt={`${token1?.name} token`}
										/>
									}
									{token1?.address && !token1?.logoURI &&
										<TokenJazzicon address={token0.address} />
									}
									<Box
										as='h3'
										m='0'
										fontSize='1.02rem'
										fontWeight='bold'
										textTransform='capitalize'>{token1?.symbol}</Box>
								</Box>
							</Flex>
						</InputRightAddon>
					}
				</InputGroup>
			</Flex>
			<Button
				variant='solid'
				size='lg'
				h='3.333rem'
			>
				Swap
			</Button>
		</Flex>
	)
}
