import { mode } from '@chakra-ui/theme-tools'

export default {
	baseStyle: {
		thumb: {
			bg: '#4F4F4F',
		},
		track: {
			bg: '#ffffffd6',
			_checked: {
				bg: 'bluish.300',
			},
			_focus: {
				boxShadow: '0 0 0 3px #7b7ce0',
			},
		},
	},
	variants: {
		wide: (props) => ({
			thumb: {
				width: '50%',
				bg: mode('accent.light.10', 'accent.dark.100')(props),
				_checked: {
					transform: 'translateX(100%)',
				},
			},
			label: {
				display: 'flex',
				width: '100%',
				flexDir:'row',
				justifyContent:'space-around',
				position: 'absolute',
				left: '0',
				lineHeight: '150%',
				top: '2px',
				marginInlineStart: '0.11rem',
				cursor: 'pointer',
			},
			track: {
				width: '100%',
				bg: mode('#ffffffd6', '#262626')(props),
				borderRadius: '0.34rem',
				_checked: {
					bg: 'bluish.300',
				},
				_focus: {
					boxShadow: `0 0 0 3px
					${mode('var(--chakra-colors-accent-dark-100)',
				'var(--chakra-colors-accent-light-100)')(props)}`,
				},
			},
		}),
	},
}