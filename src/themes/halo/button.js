import { mode } from '@chakra-ui/theme-tools'

export default {
	baseStyle: (props) => ({
		fontFamily: 'Button',
		_focus: {
			boxShadow: `0 0 0 3px
			${mode('var(--chakra-colors-accent-dark-100)',
			'var(--chakra-colors-accent-light-100)')(props)}`,
		},
	}),
	variants: {
		solid: (props) => ({
			color: mode('type.link.dark',
				'type.link.light')(props),
			borderWidth: '1px',
			borderStyle: 'solid',
			borderColor: mode('#0000001a', '#ffffff0f')(props),
			background: mode('accent.light.100',
				'accent.dark.100')(props),
			_hover: {
				background: mode('accent.light.50',
					'accent.dark.50')(props),
				color: mode('type.body.dark',
					'type.body.light')(props),
			},
			_active: {
				background: mode('accent.light.200',
					'accent.dark.200')(props),
			},
		}),
		solidTransparent: (props) => ({
			color: mode('type.link.dark',
				'type.link.light')(props),
			border: '0',
			background: 'transparent',
			_hover: {
				background: 'transparent',
				color: mode('type.body.dark',
					'type.body.light')(props),
			},
			_active: {
				background: 'transparent',
			},
		}),
		modalCentricLarge: (props) => ({
			background: 'transparent',
			width: '100%',
			minH: '114px',
			borderRadius: '0.68rem',
			lineHeight: 'unset',
			cursor: 'pointer',
			padding: '1rem',
			_hover: {
				background: mode('#FFF7E8',
					'#1f1f1f')(props),
			},
			_active: {
				background: mode('#FFF7E8',
					'#131313')(props),
			},
			_focus: {
				background: mode('#FFF7E8',
					'#0f0f0f')(props),
			},
		}),
		link: (props) => ({
			color: mode('type.link.dark',
				'type.link.light')(props),
			height: 'auto',
			_hover: {
				color: mode('#222',
					'#E1E1E1')(props),
				textDecoration: 'none',
			},
		}),
		ghost: (props) => ({
			color: mode('type.link.dark',
				'type.link.light')(props),
			_hover: {
				background: 'transparent',
				color: mode('#222',
					'#E1E1E1')(props),
			},
			_active: {
				background: 'transparent',
			},
		}),
		ghostDark: () => ({
			color: '#4F4F4F',
			_hover: {
				background: 'transparent',
			},
			_active: {
				background: 'transparent',
			},
		}),
		ghostSelectable: () => ({
			p: '0',
			borderRadius: '0',
			_hover: {
				background: '#ffffff91',
			},
			_active: {
				background: '#ffffff50',
			},
			_focus: {
				background: '#ffffff30',
			},
		}),
	},
}
