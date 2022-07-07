const phase1 = [{ 'inputs':[{ 'internalType':'address', 'name':'weth', 'type':'address' }, { 'internalType':'address', 'name':'halo', 'type':'address' }, { 'internalType':'address', 'name':'uniswapRouter', 'type':'address' }, { 'internalType':'address', 'name':'ve', 'type':'address' }, { 'internalType':'address', 'name':'router', 'type':'address' }, { 'internalType':'address', 'name':'haloFactory', 'type':'address' }, { 'internalType':'address[]', 'name':'pairs', 'type':'address[]' }], 'stateMutability':'nonpayable', 'type':'constructor' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'claimer', 'type':'address' }, { 'indexed':false, 'internalType':'uint256', 'name':'amount', 'type':'uint256' }], 'name':'ClaimHalo', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'pair', 'type':'address' }, { 'indexed':false, 'internalType':'uint256', 'name':'amount', 'type':'uint256' }, { 'indexed':false, 'internalType':'uint256', 'name':'lockPeriod', 'type':'uint256' }], 'name':'DepositLp', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'pair', 'type':'address' }, { 'indexed':false, 'internalType':'uint256', 'name':'amount', 'type':'uint256' }, { 'indexed':false, 'internalType':'uint256', 'name':'lockPeriod', 'type':'uint256' }], 'name':'DepositToPhase2', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'uint256', 'name':'startTime', 'type':'uint256' }, { 'indexed':false, 'internalType':'uint256', 'name':'endTime', 'type':'uint256' }], 'name':'Initialized', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'owner', 'type':'address' }], 'name':'NewOwner', 'type':'event' }, { 'anonymous':false, 'inputs':[{ 'indexed':false, 'internalType':'address', 'name':'pair', 'type':'address' }, { 'indexed':false, 'internalType':'uint256', 'name':'amount', 'type':'uint256' }], 'name':'Withdraw', 'type':'event' }, { 'inputs':[], 'name':'HALO_PER_PAIR', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'WETH', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'acceptOwner', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }], 'name':'claimLP', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'deleteOwner', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }, { 'internalType':'uint256', 'name':'amount0', 'type':'uint256' }, { 'internalType':'uint256', 'name':'amount1', 'type':'uint256' }, { 'internalType':'uint256', 'name':'lockPeriodInDays', 'type':'uint256' }], 'name':'deposit', 'outputs':[], 'stateMutability':'payable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }, { 'internalType':'uint256', 'name':'amount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'lockPeriodInDays', 'type':'uint256' }], 'name':'depositLP', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }, { 'internalType':'uint256', 'name':'lockPeriodInDays', 'type':'uint256' }], 'name':'depositToPhase2', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'name':'depositors', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'endTime', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'getDepositorsCount', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'haloRouter', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'initialize', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'name':'isDepositor', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'name':'isStablePair', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'migrateLiquidityToHaloAMM', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'owner', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'pendingOwner', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[], 'name':'phase2', 'outputs':[{ 'internalType':'contract Phase2', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'', 'type':'address' }, { 'internalType':'address', 'name':'', 'type':'address' }], 'name':'positions', 'outputs':[{ 'internalType':'uint256', 'name':'expireTime', 'type':'uint256' }, { 'internalType':'uint256', 'name':'multiplier', 'type':'uint256' }, { 'internalType':'uint256', 'name':'amount', 'type':'uint256' }, { 'internalType':'uint256', 'name':'half', 'type':'uint256' }, { 'internalType':'uint256', 'name':'withdrawnOn4thDay', 'type':'uint256' }, { 'internalType':'uint256', 'name':'withdrawnTillPart3', 'type':'uint256' }, { 'internalType':'bool', 'name':'evaluated', 'type':'bool' }, { 'internalType':'bool', 'name':'deposited', 'type':'bool' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }, { 'internalType':'address', 'name':'account', 'type':'address' }], 'name':'quoteHALO', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'_newOwner', 'type':'address' }], 'name':'setOwner', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'contract Phase2', 'name':'_phase2', 'type':'address' }], 'name':'setPhase2', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'setStop', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }, { 'internalType':'uint256', 'name':'start', 'type':'uint256' }, { 'internalType':'uint256', 'name':'end', 'type':'uint256' }], 'name':'stakeToHALO', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'startTime', 'outputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'name':'supportedPairs', 'outputs':[{ 'internalType':'bool', 'name':'', 'type':'bool' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'uint256', 'name':'', 'type':'uint256' }], 'name':'supportedPairsAddresses', 'outputs':[{ 'internalType':'address', 'name':'', 'type':'address' }], 'stateMutability':'view', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }, { 'internalType':'uint256', 'name':'amount', 'type':'uint256' }], 'name':'withdraw', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[], 'name':'withdrawETH', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'inputs':[{ 'internalType':'address', 'name':'pair', 'type':'address' }], 'name':'withdrawWhenStoped', 'outputs':[], 'stateMutability':'nonpayable', 'type':'function' }, { 'stateMutability':'payable', 'type':'receive' }]

export { phase1 }