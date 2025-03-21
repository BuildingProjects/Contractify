// Contract ABI for Contractify smart contract
const ContractABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "contractId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "name": "storeCID",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "contractId",
          "type": "string"
        }
      ],
      "name": "getCID",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  module.exports = {
    abi: ContractABI
  }; 