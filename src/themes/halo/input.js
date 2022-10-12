import { mode } from '@chakra-ui/theme-tools'

export default {
	baseStyle: {
		field: {
			borderWidth: '3px',
		},
	},
	variants: {
		transparent: () => ({
			field: {
				color: '#fff',
				_placeholder: {
					color: '#fff',
					fontWeight: '400',
				},
				paddingInlineStart: '0',
				paddingInlineEnd: '0',
				background: 'transparent',
				_disabled: {
					opacity: '0.1',
				},
				_hover: {
					background: 'transparent',
				},
				_focus: {
					border: 'none',
					background: 'transparent',
				},
				InputRightAddon: {
					background: 'red',
				},
			},
		}),
		filled: () => ({
			field: {
				borderRadius: '0.8rem',
				background: '#13070e',
				borderStyle: 'solid',
				_placeholder: {
					color: '#fff',
				},
				_hover: {
					background: '#13070e',
				},
				_focus: {
					borderColor: '#ff8ac0',
					background: '#13070e',
				},
			},
		}),
		blank: (props) => ({
			field: {
				borderRadius: '0.8rem',
				background: mode('white', '#ffffff0a')(props),
				borderStyle: 'solid',
				color: mode('black', 'white')(props),
				borderColor: mode('', '#6d639454')(props),
				_placeholder: {
					color: mode('#000', '#fff')(props),
				},
				_hover: {
					background: mode('white', '#ffffff0a')(props),
				},
				_focus: {
					borderColor: mode('accent.dark.100', 'accent.light.100')(props),
					background: mode('white', '#ffffff0a')(props),
				},
			},
		}),
		outline: () => ({
			field: {
				color: '#fff',
				borderRadius: '0.8rem',
				_placeholder: {
					color: '#fff',
				},
				_focus: {
					borderColor: '#7b7ce0',
					boxShadow: '0 0 0 3px #7b7ce0',
				},
			},
		}),
	},
}
