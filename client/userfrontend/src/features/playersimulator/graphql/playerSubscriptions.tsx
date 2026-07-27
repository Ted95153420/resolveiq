import { gql } from "@apollo/client";

export const PLAYER_BALANCE_UPDATED_SUBSCRIPTION = gql`
    subscription PlayerBalanceUpdated($username: String!) {
        playerBalanceUpdated(username: $username) {
            username
            loyaltypointbalance
        }
    }
`;