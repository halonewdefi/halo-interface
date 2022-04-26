import React from 'react'
import PropTypes from 'prop-types'
import { Menu, MenuItem, MenuButton, IconButton, MenuList } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'

export const BurgerMenu = (props) => {
	BurgerMenu.propTypes = {
		pages: PropTypes.array.isRequired,
	}
	return (
		<Menu
			autoSelect={false}
		>
			<MenuButton
				as={IconButton}
				aria-label='Options'
				icon={<HamburgerIcon />}
				variant='solid'
			/>
			<MenuList>
				{props.pages.map(p => <Link
					key={p.name}
					to={p.link}
				>
					<MenuItem key={p.name}>
						{p.text}
					</MenuItem>
				</Link>)}
			</MenuList>
		</Menu>
	)
}
