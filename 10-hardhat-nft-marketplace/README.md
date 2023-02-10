# Hardhat NFT Marketplace

This repo is for the NftMarketplace Backend(Smart Contracts)

- Related repos
 - [Frontend](https://github.com/VeerniVishwanath/blockchain-fcc/blob/main/12-nextjs-nft-marketplace-thegraph)
 - [TheGraph](https://github.com/VeerniVishwanath/blockchain-fcc/tree/main/13-graph-nft-marketplace)

Project is Live on [Vercel](https://nft-marketplace-gamma-six.vercel.app/)
 
<br/>
<p align="center">
<img src="./img/hero.png" width="500" alt="Hardhat NextJS Marketplace">
</a>
</p>
<br/>

[Full Repo](https://github.com/VeerniVishwanath/blockchain-fcc)

-   [Getting Started](#getting-started)
    -   [Requirements](#requirements)
    -   [Quickstart](#quickstart)
-   [Usage](#usage)
    -   [Deploy](#deploy)
    -   [Testing](#testing)
-   [Deployment to a testnet or mainnet](#deployment-to-a-testnet-or-mainnet)
-   [Thank you!](#thank-you)

# Getting Started

## Requirements

-   [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    -   You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
-   [Nodejs](https://nodejs.org/en/)
    -   You'll know you've installed nodejs right if you can run:
        -   `node --version` and get an ouput like: `vx.x.x`
-   [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
    -   You'll know you've installed yarn right if you can run:
        -   `yarn --version` and get an output like: `x.x.x`
        -   You might need to install it with `npm`

## Quickstart

```
git clone https://github.com/VeerniVishwanath/blockchain-fcc
cd blockchain-fcc/10-hardhat-nft-marketplace
yarn
```

# Usage

## Deploy

```
yarn hardhat deploy
```

## Testing

```
yarn hardhat test
```

# Deployment to a testnet or mainnet

1. Setup environment variabltes

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

-   `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
    -   You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
-   `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy

```
yarn hardhat deploy --network goerli
```

# Thank you!

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/veerni_v)

[![Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vishwanath-veerni/)
