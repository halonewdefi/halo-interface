import React from 'react'
import { useBreakpointValue, Flex, Image, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const Logotype = (props) => {

	// eslint-disable-next-line quotes
	const primary = "data:image/svg+xml,%3Csvg width='200' height='248' viewBox='0 0 200 248' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M94.73 178.93H89.47V184.2H94.73H99.99V178.93V173.67H94.73V178.93Z' fill='%2316385A'/%3E%3Cpath d='M89.47 205.25V210.51H94.73H99.99V205.25H94.73H89.47Z' fill='%2316385A'/%3E%3Cpath d='M89.47 189.46V194.72H94.73H99.99V189.46H94.73H89.47Z' fill='%2316385A'/%3E%3Cpath d='M89.47 194.72H84.21V199.98H89.47V194.72Z' fill='%2316385A'/%3E%3Cpath d='M89.47 42.11H84.2H78.94V47.36V52.63H84.2H89.47H94.73H100V47.36V42.11H94.73H89.47Z' fill='%2316385A'/%3E%3Cpath d='M89.47 0H63.15V5.26H42.15V10.53H36.84V15.78H31.57V21.05H26.31V31.58H31.57V36.84H36.84V42.11H42.1V47.36H57.89V73.68H52.63V89.46H47.36V57.88H42.1V63.15H36.83V68.41H31.58V73.68H26.31V94.68H31.58V105.21H26.31V100H21.05V84.2H15.78V89.46H10.52V121H15.78V131.53H21.05V136.78H10.52V126.31H5.26V121H0V142H5.26V152.53H10.52V168.4H15.78V184.2H21.05V189.46H26.31V200H31.58V205.27H36.83V184.2H31.58V163.2H36.83V157.93H42.1V147.35H36.83V142.09H31.58V126.31H36.83V121H42.1V110.51H47.36V105.26H52.63V100H68.41V94.73H73.68V78.94H78.94V99.94H73.68V105.21H63.16V115.73H52.63V126.26H42.1V142.04H47.36V163.1H42.1V210.46H47.36V215.73H52.63V221H57.89V226.27H63.16V231.53H68.41V236.8H73.68V242.06H78.94V247.32H99.94V226.32H78.94V221H68.41V215.75H63.16V210.48H57.89V184.2H52.63V168.4H57.89V163.15H84.21V157.88H89.47V136.82H57.89V131.57H63.16V126.31H68.41V121H73.68V115.74H78.94V110.47H99.94V89.46H94.73V100H89.47V73.68H94.73V84.2H100V57.88H89.47V63.15H84.21V68.41H78.94V31.57H73.68V36.83H68.41V42.1H63.16V47.36V42.11H52.63V36.84H42.1V31.58H36.84V21.05H42.1V15.78H52.63V10.53H79V5.26H100V0H89.47ZM73.68 142.09H84.21V147.35H68.41V142.09H73.68Z' fill='%2316385A'/%3E%3Cpath d='M100.01 205.25V210.51H105.27H110.53V205.25H105.27H100.01Z' fill='%23DDA11D'/%3E%3Cpath d='M100.01 173.67V178.93V184.2H105.27H110.53V178.93H105.27V173.67H100.01Z' fill='%23DDA11D'/%3E%3Cpath d='M105.27 189.46H100.01V194.72H105.27H110.53V189.46H105.27Z' fill='%23DDA11D'/%3E%3Cpath d='M115.79 194.72H110.53V199.98H115.79V194.72Z' fill='%23DDA11D'/%3E%3Cpath d='M194.74 121V126.27H189.48V136.78H179V131.53H184.27V121H189.53V89.46H184.27V84.2H179V100H173.74V105.27H168.47V94.73H173.74V73.73H168.47V68.41H163.22V63.15H157.9V57.88H152.64V89.46H147.37V73.68H142.11V47.36H157.9V42.11H163.16V36.84H168.43V31.58H173.69V21.05H168.43V15.78H163.16V10.53H157.9V5.26H136.85V0H100V5.26H121V10.53H147.32V15.78H157.9V21.05H163.16V31.58H157.9V36.84H147.37V42.11H136.85V47.36V42.1H131.6V36.83H126.33V31.57H121.07V68.41H115.8V63.15H110.54V57.88H100V84.2H105.26V73.68H110.52V100H105.26V89.46H100V110.51H121V115.78H126.26V121H131.53V126.27H136.78V131.53H142.05V136.78H110.53V157.84H115.79V163.11H142.11V168.36H147.37V184.16H142.11V210.47H136.84V215.74H131.59V221H121.06V226.27H100V247.27H121V242.01H126.26V236.75H131.53V231.48H136.78V226.3H142.05V221H147.31V215.75H152.58V210.48H157.84V163.15H152.58V142.09H157.84V126.31H147.37V115.78H136.84V105.26H126.32V100H121.06V79H126.32V94.73H131.59V100H147.37V105.27H152.64V110.52H157.9V121H163.17V126.27H168.42V142.05H163.17V147.31H157.9V157.84H163.17V163.11H168.42V184.11H163.17V205.16H168.42V200H173.69V189.46H179V184.2H184.27V168.4H189.53V152.62H194.79V142.09H200V121H194.74ZM115.79 142H131.59V147.26H115.79V142Z' fill='%23DDA11D'/%3E%3Cpath d='M110.53 52.63H115.8H121.05V47.36V42.11H115.8H110.53H105.27H100V47.36V52.63H105.27H110.53Z' fill='%23DDA11D'/%3E%3C/svg%3E"

	const height = useBreakpointValue({
		base: '48px',
	})

	const color = useColorModeValue('', '#dda11d')

	return (
		<Flex
			flexDir='row'
			gap='7px'
			alignItems='center'
		>
			<Link style={{ alignSelf: 'center' }} to='/'>
				<Image
					style={{ maxHeight: height }}
					src={primary}
					alt='Halo DeFi Official Logotype'
					{...props}
				/>
			</Link>
			<Link to='/'>
				<Flex
					as='h4'
					fontSize='0.8rem'
					lineHeight='16px'
					mt='7px'
					color={color}
				>
					HALO<br/>DEFI
				</Flex>
			</Link>
		</Flex>
	)
}
