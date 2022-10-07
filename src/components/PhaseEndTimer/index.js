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
						{`Day${(days === 1) ? '' : 's'}`}
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
						{`Hour${(hours === 1) ? '' : 's'}`}
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
						{`Min${(minutes === 1) ? '' : 's'}`}
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
			flexDir='column'
			w='100%'
			p='1.222rem 0 2rem 0'
		>
			<Flex
				flexDir='row'
				w='100%'
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
					<Skeleton
						isLoaded={!isNaN(date)}
					>
						<Flex
							minW='156.083px'
							h='48px'
						>
							<Flex
								flexDir='column'
								justifyContent='center'
							>
								{!isNaN(date) &&
								<Countdown
									date={date}
									renderer={time}
								/>
								}
							</Flex>
						</Flex>
					</Skeleton>
				</Flex>
			</Flex>
		</Flex>
	)
}
