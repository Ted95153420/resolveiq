import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";

import PlayerSimulatorPage from "./PlayerSimulatorPage";

import {
    PLAYER_ACCOUNT_QUERY,
    PLAYER_CHOICES_QUERY,
} from "../graphql/playerQueries";

import userEvent from "@testing-library/user-event";

import {
    PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
} from "../graphql/playerSubscriptions";

const danAccountMock = {
    request: {
        query: PLAYER_ACCOUNT_QUERY,
        variables: {
            username: "DSmith",
        },
    },

    result: {
        data: {
            playerAccount: {
                __typename: "PlayerAccount",
                id: 1,
                name: "Dan Smith",
                username: "DSmith",
                loyaltypointbalance: 1000,
            },
        },
    },
};

const danLiveBalanceUpdateMock = {
    request: {
        query: PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
        variables: {
            username: "DSmith",
        },
    },

    delay: 100,

    result: {
        data: {
            playerBalanceUpdated: {
                __typename: "PlayerBalanceUpdate",
                username: "DSmith",
                loyaltypointbalance: 1500,
            },
        },
    },
};

const danBalanceSubscriptionMock = {
    request: {
        query: PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
        variables: {
            username: "DSmith",
        },
    },

    result: {
        data: {
            playerBalanceUpdated: {
                __typename: "PlayerBalanceUpdate",
                username: "DSmith",
                loyaltypointbalance: 1000,
            },
        },
    },
};

const danReselectedAccountMock = {
    request: {
        query: PLAYER_ACCOUNT_QUERY,
        variables: {
            username: "DSmith",
        },
    },

    result: {
        data: {
            playerAccount: {
                __typename: "PlayerAccount",
                id: 1,
                name: "Dan Smith",
                username: "DSmith",
                loyaltypointbalance: 1500,
            },
        },
    },
};

const danReselectedSubscriptionMock = {
    request: {
        query: PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
        variables: {
            username: "DSmith",
        },
    },

    result: {
        data: {
            playerBalanceUpdated: {
                __typename: "PlayerBalanceUpdate",
                username: "DSmith",
                loyaltypointbalance: 1500,
            },
        },
    },
};

const miaAccountMock = {
    request: {
        query: PLAYER_ACCOUNT_QUERY,
        variables: {
            username: "MCooper",
        },
    },

    result: {
        data: {
            playerAccount: {
                __typename: "PlayerAccount",
                id: 2,
                name: "Mia Cooper",
                username: "MCooper",
                loyaltypointbalance: 500,
            },
        },
    },
};

const miaBalanceSubscriptionMock = {
    request: {
        query: PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
        variables: {
            username: "MCooper",
        },
    },

    result: {
        data: {
            playerBalanceUpdated: {
                __typename: "PlayerBalanceUpdate",
                username: "MCooper",
                loyaltypointbalance: 500,
            },
        },
    },
};

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
                    loyaltypointbalance: 100,
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

it("displays the authoritative account balance when a player is selected", async () => {
    const user = userEvent.setup();

    render(
        <MockedProvider
            mocks={[
                playerChoicesMock,
                danAccountMock,
                danBalanceSubscriptionMock,
            ]}
        >
            <PlayerSimulatorPage />
        </MockedProvider>
    );

    const playerSelector =
        await screen.findByRole("combobox", {
            name: "Select a player",
        });

    await user.click(playerSelector);

    await user.click(
        await screen.findByText("Dan Smith — DSmith")
    );

    expect(
        await screen.findByText(
            /current points balance is/i
        )
    ).toHaveTextContent("1,000 points");
});

it("updates the displayed balance when a subscription event is received", async () => {
    const user = userEvent.setup();

    render(
        <MockedProvider
            mocks={[
                playerChoicesMock,
                danAccountMock,
                danLiveBalanceUpdateMock,
            ]}
        >
            <PlayerSimulatorPage />
        </MockedProvider>
    );

    const playerSelector =
        await screen.findByRole("combobox", {
            name: "Select a player",
        });

    await user.click(playerSelector);

    await user.click(
        await screen.findByText("Dan Smith — DSmith")
    );

    const pointsMessage =
        await screen.findByText(
            /current points balance is/i
        );

    expect(pointsMessage).toHaveTextContent(
        "1,000 points"
    );

    await waitFor(() => {
        expect(pointsMessage).toHaveTextContent(
            "1,500 points"
        );
    });
});

it("displays the authoritative balance after an adjusted player is reselected", async () => {
    const user = userEvent.setup();

    render(
        <MockedProvider
            mocks={[
                playerChoicesMock,

                // First Dan selection
                danAccountMock,
                danLiveBalanceUpdateMock,

                // Mia selection
                miaAccountMock,
                miaBalanceSubscriptionMock,

                // Second Dan selection
                danReselectedAccountMock,
                danReselectedSubscriptionMock,
            ]}
        >
            <PlayerSimulatorPage />
        </MockedProvider>
    );

    const playerSelector =
        await screen.findByRole("combobox", {
            name: "Select a player",
        });

    /*
     * Select Dan. The authoritative account query
     * initially returns 1,000 points.
     */
    await user.click(playerSelector);

    await user.click(
        await screen.findByText("Dan Smith — DSmith")
    );

    const pointsMessage =
        await screen.findByText(
            /current points balance is/i
        );

    expect(pointsMessage).toHaveTextContent(
        "1,000 points"
    );

    /*
     * Dan's subscription then reports the adjusted
     * balance of 1,500 points.
     */
    await waitFor(() => {
        expect(pointsMessage).toHaveTextContent(
            "1,500 points"
        );
    });

    /*
     * Switch to Mia.
     */
    await user.click(playerSelector);
    await user.clear(playerSelector);
    await user.type(playerSelector, "Mia");

    await user.click(
        await screen.findByText("Mia Cooper — MCooper")
    );

    await waitFor(() => {
        expect(
            screen.getByText(
                /current points balance is/i
            )
        ).toHaveTextContent("500 points");
    });

    /*
     * Reselect Dan.
     */
    await user.click(playerSelector);
    await user.clear(playerSelector);
    await user.type(playerSelector, "Dan");

    await user.click(
        await screen.findByText("Dan Smith — DSmith")
    );

    /*
     * The fresh playerAccount query must supply
     * Dan's authoritative 1,500-point balance.
     *
     * It must not fall back to the stale value of
     * 100 contained in playerChoicesMock.
     */
    await waitFor(() => {
        expect(
            screen.getByText(
                /current points balance is/i
            )
        ).toHaveTextContent("1,500 points");
    });

    expect(
        screen.getByText(
            /current points balance is/i
        )
    ).not.toHaveTextContent("100 points");
});