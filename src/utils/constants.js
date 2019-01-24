import uuid from 'react-native-uuid';
const contractAddress = '0xc573c48ad1037dd92cb39281e5f55dcb5e033a70';

const defaultTokens = [
  {
    name: 'XDC',
    id: uuid.v4(),
    symbol: 'XDC',
    contractAddress: contractAddress,
    decimals: 18,
    currencySymbol: 'USD',
    network: 'mainnet',
  },
  {
    name: 'MXDC',
    id: uuid.v4(),
    symbol: 'MXDC',
    contractAddress: null,
    decimals: 18,
    currencySymbol: 'USD',
    network: 'private',
  },
  {
    name: 'DAIVIK',
    id: uuid.v4(),
    symbol: 'DAI',
    contractAddress: "0x5B0e5360CC8974A007da9F05BeDc3d370e1a924f",
    decimals: 18,
    currencySymbol: 'USD',
    network: 'ropsten',
  },
];

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    constant: true,
    payable: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
  },
  {
    name: 'transfer',
    type: 'function',
    constant: false,
    payable: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
  },
];

export { defaultTokens, erc20Abi };
