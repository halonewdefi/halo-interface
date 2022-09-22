import React from 'react'
import {
	Flex,
	Box,
	Skeleton,
} from '@chakra-ui/react'
import Countdown from 'react-countdown'
import { usePhase1endTime } from '../../hooks/'

export const PhaseEndTimer = (props) => {

	const phase1endTime = usePhase1endTime()
	const date = new Date(phase1endTime?.data?.toNumber() * 1000)

	const time = ({ days, hours, minutes }) => {

		const unit = {
			flexDirection: 'column',
		}

		const unitValue = {
			fontWeight: '600',
			textAlign: 'center',
		}

		return (
			<Flex
				flexDir='row'
				gap='1.2rem'
			>
				<Flex
					{...unit}
				>
					<Skeleton
						isLoaded={phase1endTime?.isSuccess}
					>
						<Box
							{...unitValue}
						>
							{days}
						</Box>
					</Skeleton>
					<Box>
						Days
					</Box>
				</Flex>
				<Flex
					{...unit}
				>
					<Box
						{...unitValue}
					>
						<Skeleton
							isLoaded={phase1endTime?.isSuccess}
						>
							{hours}
						</Skeleton>
					</Box>
					<Box>
						Hours
					</Box>
				</Flex>
				<Flex
					{...unit}
				>
					<Box
						{...unitValue}
					>
						<Skeleton
							isLoaded={phase1endTime?.isSuccess}
						>
							{minutes}
						</Skeleton>
					</Box>
					<Box>
						Mins
					</Box>
				</Flex>
			</Flex>
		)
	}

	const descStyle = {
		fontWeight: '600',
		mb: '0',
	}

	return (
		<Flex
			flexDir='row'
			w='100%'
			p='0.8rem 1.3rem'
			justifyContent='space-between'
		>
			<Flex
				flexDir='column'
				justifyContent='center'
			>
				<Box
					as='h4'
					paddingTop='8px'
					{...descStyle}>
						Phase 1
				</Box>
				<Box
					fontStyle='italic'
				>Ends in</Box>
			</Flex>

			<Flex
				flexDir='row'
			>
				<Flex
				>
					<Flex
						flexDir='column'
						justifyContent='center'
					>
						<Countdown
							date={date}
							renderer={time}
						/>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}
