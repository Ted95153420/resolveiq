import { gql } from "@apollo/client";

export const PLAYER_CHOICES_QUERY = gql`
    query PlayerChoices {
        playerChoices {
            id
            name
            username
        }
    }
`;