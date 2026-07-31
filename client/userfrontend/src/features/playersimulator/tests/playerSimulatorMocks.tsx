import type {
    MockedResponse,
} from "@apollo/client/testing";

import {
    PLAYER_ACCOUNT_QUERY,
    PLAYER_CHOICES_QUERY,
} from "../graphql/playerQueries";

import {
    PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
} from "../graphql/playerSubscriptions";

type MockPlayer = {
    id: number;
    name: string;
    username: string;
};

type CreatePlayerAccountMockOptions = MockPlayer & {
    pointsBalance: number;
};

type CreateBalanceSubscriptionMockOptions = {
    username: string;
    pointsBalance: number;
    delay?: number;
};

export const danSmith: MockPlayer = {
    id: 1,
    name: "Dan Smith",
    username: "DSmith",
};

export const miaCooper: MockPlayer = {
    id: 2,
    name: "Mia Cooper",
    username: "MCooper",
};

/*
 * The balance for Dan is deliberately stale.
 *
 * This is essential to the regression test. If the application
 * accidentally starts trusting playerChoices for account details
 * again, it will display 100 instead of the authoritative balance.
 */
export const playerChoicesMock: MockedResponse = {
    request: {
        query: PLAYER_CHOICES_QUERY,
    },

    result: {
        data: {
            playerChoices: [
                {
                    __typename: "PlayerChoice",
                    ...danSmith,
                    loyaltypointbalance: 100,
                },
                {
                    __typename: "PlayerChoice",
                    ...miaCooper,
                    loyaltypointbalance: 500,
                },
            ],
        },
    },
};

export function createPlayerAccountMock({
    id,
    name,
    username,
    pointsBalance,
}: CreatePlayerAccountMockOptions): MockedResponse {
    return {
        request: {
            query: PLAYER_ACCOUNT_QUERY,
            variables: {
                username,
            },
        },

        result: {
            data: {
                playerAccount: {
                    __typename: "PlayerAccount",
                    id,
                    name,
                    username,
                    loyaltypointbalance: pointsBalance,
                },
            },
        },
    };
}

export function createBalanceSubscriptionMock({
    username,
    pointsBalance,
    delay,
}: CreateBalanceSubscriptionMockOptions): MockedResponse {
    return {
        request: {
            query: PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
            variables: {
                username,
            },
        },

        /*
         * Leave delay undefined for immediate subscription results.
         * A delay is useful when a test must first assert the account
         * query balance and then observe a later live update.
         */
        ...(delay !== undefined
            ? {
                delay,
            }
            : {}),

        result: {
            data: {
                playerBalanceUpdated: {
                    __typename: "PlayerBalanceUpdate",
                    username,
                    loyaltypointbalance: pointsBalance,
                },
            },
        },
    };
}

/*
 * Dan's authoritative account balance when first selected.
 */
export const danInitialAccountMock =
    createPlayerAccountMock({
        ...danSmith,
        pointsBalance: 1000,
    });

/*
 * Used by the simpler test proving that the selected player's
 * authoritative account balance is displayed.
 */
export const danInitialSubscriptionMock =
    createBalanceSubscriptionMock({
        username: danSmith.username,
        pointsBalance: 1000,
    });

/*
 * Simulates Dan receiving a live points adjustment while selected.
 */
export const danLiveBalanceUpdateMock =
    createBalanceSubscriptionMock({
        username: danSmith.username,
        pointsBalance: 1500,
        delay: 100,
    });

export const miaAccountMock =
    createPlayerAccountMock({
        ...miaCooper,
        pointsBalance: 500,
    });

export const miaBalanceSubscriptionMock =
    createBalanceSubscriptionMock({
        username: miaCooper.username,
        pointsBalance: 500,
    });

/*
 * When Dan is reselected, the authoritative account query now
 * returns the adjusted database balance.
 */
export const danReselectedAccountMock =
    createPlayerAccountMock({
        ...danSmith,
        pointsBalance: 1500,
    });

export const danReselectedSubscriptionMock =
    createBalanceSubscriptionMock({
        username: danSmith.username,
        pointsBalance: 1500,
    });