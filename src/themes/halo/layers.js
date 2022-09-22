export default {
	hr: {
		width: '100%',
		height: '1px',
		background: '#7D786E26',
	},
	box: {
		background: '#7D786E26',
		padding: '1rem',
		// border: '1px solid #98989933',
		borderRadius: '0.34rem',
		// boxShadow: '0px 2px 5px -3px #1b3b5b29',
		transitionProperty: 'var(--chakra-transition-property-common)',
		transitionDuration: 'var(--chakra-transition-duration-normal)',
		'.chakra-ui-dark &': {
		},
	},
	card: {
		background: '#d2d7dd61',
		border: '1px solid #98989933',
		borderRadius: '0.34rem',
		boxShadow: '0px 2px 5px -3px #1b3b5b29',
		transitionProperty: 'var(--chakra-transition-property-common)',
		transitionDuration: 'var(--chakra-transition-duration-normal)',
		_hover: {
			background: '#d2d7dd91',
			cursor: 'pointer',
		},
		'.chakra-ui-dark &': {
			background: '#d2d7dd08',
			border: '1px solid #9898991c',
			_hover: {
				background: '#d2d7dd0d',
			},
		},
	},
}