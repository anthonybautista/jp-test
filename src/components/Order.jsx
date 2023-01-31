import { Typography, Box, Divider, TextField, Button } from '@mui/material';
import React, { Component } from 'react';
import axios from "axios";


class Order extends Component {
    state = {
        addr: "0x5fbf285083104bbe208e11EEd8860E384f248DFE",
        token: 18114,
        name: '',
        price: 0,
        currentAsk: {}
    }
    // helper methods
    updateAddrValue(evt) {
        const val = evt.target.value;
        // ...       
        this.setState({
        addr: val
        });
    }

    updateTokenValue(evt) {
        const val = evt.target.value;
        // ...       
        this.setState({
        token: val
        });
    }

    async getNFTData(addr, token) {
        const options = {
            method: 'GET',
            url: `https://barn.joepegs.com/v2/collections/${addr}/tokens/${token}`,
            'Access-Control-Allow-Origin': '*'
        };
        axios.request(options).then((response) => {
            const data = response.data.currentAsk;
            this.setState({
                name: response.data.collectionName,
                price: data.price / 10**18,
                currentAsk: data
            });
        });
    }      

  render() { 
    const { buyNFT } = this.props;
    return (
      <div>
        <div>
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { mx: 'auto', mt: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="addr"
          label="Contract Address"
          value={this.state.addr}
          variant="filled"
          fullWidth
          size="small"
          onChange={evt => this.updateAddrValue(evt)}
        />
        <TextField
          required
          id="token"
          label="TokenId"
          type="number"
          value={this.state.token}
          variant="filled"
          fullWidth
          onChange={evt => this.updateTokenValue(evt)}
        />
        <Button variant="outlined" onClick={() => this.getNFTData(this.state.addr, this.state.token)} sx={{ mt: 1 }}>Get NFT Info</Button>
      </div>
    </Box>
        </div>
        <Box
        sx={{

        }}
        >
            <div>
                <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Collection: {this.state.name}</Typography>
                <Typography sx={{ mt: 1 }}>Price: {this.state.price}</Typography>
            </div>
        </Box>
        <Divider/>
        <Box
        sx={{
        }}
        >
            <Button variant="outlined" onClick={() => buyNFT(this.state.currentAsk)} sx={{ mt: 1 }}>Buy NFT</Button>
        </Box>
      </div>
    );
  }
}

export default Order