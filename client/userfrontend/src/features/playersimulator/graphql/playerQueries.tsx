import { gql } from "@apollo/client";

export const PLAYER_CHOICES_QUERY = gql`
    query PlayerChoices {
        playerChoices {
            id
            name
            username
            loyaltypointbalance
        }
    }
`;

export const PLAYER_ACCOUNT_QUERY = gql`
    query PlayerAccount($username: String!) {
        playerAccount(username: $username) {
            id
            name
            username
            loyaltypointbalance
        }
    }
`;