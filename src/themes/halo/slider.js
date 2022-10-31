import { mode } from '@chakra-ui/theme-tools'

export default {
	baseStyle: (props) => ({
		_disabled: {
			opacity: '1',
		},
		track: {
			background: mode('#b3ac9e;', '#868686')(props),
		},
		thumb: {
			_focus: {
				boxShadow: `0 0 0 3px ${mode('var(--chakra-colors-accent-dark-100)',
					'var(--chakra-colors-accent-light-100)')(props)}`,
			},
		},
	}),
}
