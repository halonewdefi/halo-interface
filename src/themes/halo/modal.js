import { mode } from '@chakra-ui/theme-tools'

export default {
	baseStyle: (props) => ({
		dialogContainer: {
			alignItems: { base: 'flex-end', md: 'center' },
			margin: 0,
		},
		dialog: {
			padding: '8px 0 0',
			background: mode('bg.light', 'bg.dark')(props),
			color: mode('type.body.dark', 'type.body.light')(props),
			margin: 0,
			borderRadius: {
				base: '0.68rem 0.68rem 0 0',
				md: '0.68rem' },
		},
		body: {
			padding: '0',
		},
		header: {
			fontSize: '1.2rem',
			paddingBottom: '1.2rem',
		},
		closeButton: {
			top: '1rem',
			_focus: {
				boxShadow: `0 0 0 3px
			${mode('var(--chakra-colors-accent-dark-100)',
			'var(--chakra-colors-accent-light-100)')(props)}`,
			},
		},
	}),
}