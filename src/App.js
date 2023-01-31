import React from 'react'
import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Order from './components/Order';
import ABI from './abi/jp.json';

const injected = injectedModule()

const rpcUrl = `https://api.avax.network/ext/bc/C/rpc`

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: '0xa86a',
      token: 'AVAX',
      label: 'Avalanche Mainnet',
      rpcUrl
    }
  ]
})

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  // create an ethers provider
  let ethersProvider, signer;

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any');
    signer = ethersProvider.getSigner();
  }

  const buyNFT = async (currentAsk) => {
    const makerOrder = {
      isOrderAsk: currentAsk.isOrderAsk,
      signer: currentAsk.signer,
      collection: currentAsk.collection,
      price: currentAsk.price, 
      tokenId: currentAsk.tokenId, 
      amount: currentAsk.amount,
      strategy: currentAsk.strategy,
      currency: currentAsk.currency,
      nonce: currentAsk.nonce,
      startTime: currentAsk.startTime,
      endTime: currentAsk.endTime, 
      minPercentageToAsk: currentAsk.minPercentageToAsk,
      params: currentAsk.params,
      v: currentAsk.v,
      r: currentAsk.r,
      s: ethers.utils.hexZeroPad(currentAsk.s, 32) // TODO: Check for odd length before padding
    };
    console.log(makerOrder.s)
    const takerOrder = {
      isOrderAsk: false,
      taker: wallet.accounts[0].address,
      price: makerOrder.price,
      tokenId: makerOrder.tokenId,
      minPercentageToAsk: 7500,
      params: currentAsk.params
    };
    console.log(takerOrder)
    const exchangeInterface = new ethers.utils.Interface(ABI);
    const exchangeContract = new ethers.Contract("0xaE079eDA901F7727D0715aff8f82BA8295719977", exchangeInterface, signer);
    await exchangeContract.functions.matchAskWithTakerBid(takerOrder, makerOrder); // TODO: Add approval or use other method and send value
  }

  return (
      <Box
      sx={{
        width: 300,
        height: 300,
        mx: 'auto'
      }}
    >
      <Button disabled={connecting} variant="outlined" fullWidth sx={{ mx: 'auto', mt: 2 }} onClick={() => (wallet ? disconnect(wallet) : connect())}>
        {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
      </Button>
      <Order buyNFT={ buyNFT }/>
    </Box>
  )
}

export default App;
