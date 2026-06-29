export const VAULT_BANK_ADDRESS =
  "0x2c1a0dF1F767DA46Ea662B697408Db2Ed827fC9E";

export const VAULT_BANK_ABI: any = [
	{
		"inputs": [],
		"name": "adminWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "to",
				"type": "address"
			}
		],
		"name": "adminWithdrawTo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "AdminWithdraw",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "enabled",
				"type": "bool"
			}
		],
		"name": "DepositStatusUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			}
		],
		"name": "LimitsUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "delay",
				"type": "uint256"
			}
		],
		"name": "MaxOracleDelayUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "feed",
				"type": "address"
			}
		],
		"name": "PriceFeedUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "enabled",
				"type": "bool"
			}
		],
		"name": "setDepositEnabled",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "minDeposit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxDeposit",
				"type": "uint256"
			}
		],
		"name": "setDepositLimits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "delay",
				"type": "uint256"
			}
		],
		"name": "setMaxOracleDelay",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "feed",
				"type": "address"
			}
		],
		"name": "setPriceFeed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "enabled",
				"type": "bool"
			}
		],
		"name": "setWithdrawalEnabled",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "minWithdraw",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxWithdraw",
				"type": "uint256"
			}
		],
		"name": "setWithdrawalLimits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "enabled",
				"type": "bool"
			}
		],
		"name": "WithdrawStatusUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "cardLimits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "minDeposit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxDeposit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minWithdraw",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxWithdraw",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "depositEnabled",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "withdrawEnabled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ethUsdPriceFeed",
		"outputs": [
			{
				"internalType": "contract AggregatorV3Interface",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			}
		],
		"name": "getDepositWeiLimits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "minWei",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxWei",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestEthUsdPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "decimals",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum ViltrumVaultBankV2.CardType",
				"name": "cardType",
				"type": "uint8"
			}
		],
		"name": "getWithdrawalWeiLimits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "minWei",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxWei",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxOracleDelay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "usdCents",
				"type": "uint256"
			}
		],
		"name": "usdCentsToWei",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "weiAmount",
				"type": "uint256"
			}
		],
		"name": "weiToUsdCents",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export function getCardTypeId(cardType: string) {
  if (cardType === "free") return 0;
  if (cardType === "virtual") return 1;
  if (cardType === "physical") return 2;
  return 1;
}
