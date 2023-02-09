import { gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(
            first: 10
            where: { buyer: "0x0000000000000000000000000000000000000000" }
        ) {
            id
            seller
            buyer
            nftAddress
            tokenId
            price
        }
    }
`
const GET_BOUGHT_ITEMS = gql`
    {
        itemBoughts(first: 10) {
            id
            buyer
            nftAddress
            tokenId
            price
        }
    }
`

module.exports = { GET_ACTIVE_ITEMS, GET_BOUGHT_ITEMS }
