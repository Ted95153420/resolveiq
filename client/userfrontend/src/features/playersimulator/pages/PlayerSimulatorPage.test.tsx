import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";

import PlayerSimulatorPage from "./PlayerSimulatorPage";

import {
    PLAYER_CHOICES_QUERY,
} from "../graphql/playerQueries";

const playerChoicesMock = {
    request: {
        query: PLAYER_CHOICES_QUERY,
    },

    result: {
        data: {
            playerChoices: [
                {
                    __typename: "PlayerChoice",
                    id: 1,
                    name: "Dan Smith",
                    username: "DSmith",
                    loyaltypointbalance: 1000,
                },
                {
                    __typename: "PlayerChoice",
                    id: 2,
                    name: "Mia Cooper",
                    username: "MCooper",
                    loyaltypointbalance: 500,
                },
            ],
        },
    },
};

describe("PlayerSimulatorPage", () => {
    it("loads the available players", async () => {
        render(
            <MockedProvider mocks={[playerChoicesMock]}>
                <PlayerSimulatorPage />
            </MockedProvider>
        );

        expect(
            screen.getByRole("heading", {
                name: "Player Simulator",
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByLabelText("Select a player")
        ).toBeInTheDocument();
    });
});