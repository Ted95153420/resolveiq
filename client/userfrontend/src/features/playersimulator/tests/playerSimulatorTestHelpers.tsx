import type {
    MockedResponse,
} from "@apollo/client/testing";

import {
    MockedProvider,
} from "@apollo/client/testing/react";

import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import PlayerSimulatorPage from "../pages/PlayerSimulatorPage";

type TestUser = ReturnType<
    typeof userEvent.setup
>;

type RenderPlayerSimulatorOptions = {
    mocks: MockedResponse[];
};

type SelectPlayerOptions = {
    searchText: string;
    optionLabel: string;
};

/**
 * Renders the Player Simulator using mocked GraphQL
 * operations rather than the real API.
 */
export function renderPlayerSimulator({
    mocks,
}: RenderPlayerSimulatorOptions) {
    return render(
        <MockedProvider mocks={mocks}>
            <PlayerSimulatorPage />
        </MockedProvider>
    );
}

/**
 * Finds the Player Simulator autocomplete and selects
 * the requested player.
 *
 * Example:
 *
 * await selectPlayer(user, {
 *     searchText: "Dan",
 *     optionLabel: "Dan Smith — DSmith",
 * });
 */
export async function selectPlayer(
    user: TestUser,
    {
        searchText,
        optionLabel,
    }: SelectPlayerOptions
) {
    const playerSelector =
        await screen.findByRole("combobox", {
            name: "Select a player",
        });

    await user.click(playerSelector);
    await user.clear(playerSelector);
    await user.type(
        playerSelector,
        searchText
    );

    const playerOption =
        await screen.findByText(optionLabel);

    await user.click(playerOption);

    return playerSelector;
}

/**
 * Waits until the selected player's displayed points
 * balance matches the expected value.
 */
export async function expectDisplayedPointsBalance(
    expectedPointsBalance: number
) {
    const formattedBalance =
        expectedPointsBalance.toLocaleString(
            "en-CA"
        );

    await waitFor(() => {
        expect(
            screen.getByText(
                /current points balance is/i
            )
        ).toHaveTextContent(
            `${formattedBalance} points`
        );
    });
}

/**
 * Confirms that the displayed balance does not contain
 * a particular stale or otherwise incorrect value.
 */
export function expectDisplayedPointsBalanceNotToBe(
    unexpectedPointsBalance: number
) {
    const formattedBalance =
        unexpectedPointsBalance.toLocaleString(
            "en-CA"
        );

    expect(
        screen.getByText(
            /current points balance is/i
        )
    ).not.toHaveTextContent(
        `${formattedBalance} points`
    );
}