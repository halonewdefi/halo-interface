import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@chakra-ui/react'

export const Divider = (props) => {

	Divider.propTypes = {
		hidden: PropTypes.bool,
	}

	const { hidden, ...rest } = props

	return (
		<Box
			layerStyle={hidden ? '' : 'hr'}
			margin='0 auto 3rem auto'
			width='96%'
			{...rest}
		/>
	)
}
