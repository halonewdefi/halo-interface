import React from 'react'
import {
	Flex,
	Box,
	Skeleton,
} from '@chakra-ui/react'
import Countdown from 'react-countdown'
import { usePhase, usePhaseEndTime } from '../../hooks/'

export const PhaseEndTimer = (props) => {

	const phase = usePhase()
	const phaseEndTime = usePhaseEndTime()
	const date = new Date(phaseEndTime?.data?.toNumber() * 1000)

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
						isLoaded={phaseEndTime?.isSuccess}
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
							isLoaded={phaseEndTime?.isSuccess}
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
							isLoaded={phaseEndTime?.isSuccess}
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
				<Skeleton
					isLoaded={!!phase}
				>
					<Flex
						flexDir='column'
						justifyContent='center'
					>
						<Box
							as='h4'
							paddingTop='8px'
							{...descStyle}>
							{`Phase ${phase?.which}`}
						</Box>
						<Box
							fontStyle='italic'
						>Ends in</Box>
					</Flex>
				</Skeleton>

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
