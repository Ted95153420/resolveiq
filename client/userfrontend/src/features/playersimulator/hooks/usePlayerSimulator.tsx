import { useState } from "react";

import {
    useQuery,
    useSubscription,
} from "@apollo/client/react";

import {
    PLAYER_ACCOUNT_QUERY,
    PLAYER_CHOICES_QUERY,
} from "../graphql/playerQueries";

import {
    PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
} from "../graphql/playerSubscriptions";

import type {
    PlayerChoice,
} from "../types/playerTypes";

type PlayerChoicesData = {
    playerChoices: PlayerChoice[];
};

type PlayerAccountData = {
    playerAccount: PlayerChoice | null;
};

type PlayerAccountVariables = {
    username: string;
};

type PlayerBalanceUpdatedData = {
    playerBalanceUpdated: {
        username: string;
        loyaltypointbalance: number;
    };
};

type PlayerBalanceUpdatedVariables = {
    username: string;
};

function getDisplayedPointsBalance(
    playerAccount: PlayerChoice | null,
    balanceUpdateData: PlayerBalanceUpdatedData | undefined
): number | undefined {
    if (!playerAccount) {
        return undefined;
    }

    const balanceUpdate =
        balanceUpdateData?.playerBalanceUpdated;

    if (
        balanceUpdate &&
        balanceUpdate.username === playerAccount.username
    ) {
        return balanceUpdate.loyaltypointbalance;
    }

    return playerAccount.loyaltypointbalance;
}

export function usePlayerSimulator() {
    const [selectedPlayer, setSelectedPlayer] =
        useState<PlayerChoice | null>(null);

    const {
        data: playerChoicesData,
        loading: loadingPlayers,
        error: playerQueryError,
    } = useQuery<PlayerChoicesData>(
        PLAYER_CHOICES_QUERY
    );

    const {
        data: playerAccountData,
        loading: loadingPlayerAccount,
        error: playerAccountError,
    } = useQuery<
        PlayerAccountData,
        PlayerAccountVariables
    >(
        PLAYER_ACCOUNT_QUERY,
        {
            variables: {
                username: selectedPlayer?.username ?? "",
            },
            skip: selectedPlayer === null,
            fetchPolicy: "network-only",
        }
    );

    const {
        data: balanceUpdateData,
        error: subscriptionError,
    } = useSubscription<
        PlayerBalanceUpdatedData,
        PlayerBalanceUpdatedVariables
    >(
        PLAYER_BALANCE_UPDATED_SUBSCRIPTION,
        {
            variables: {
                username:
                    selectedPlayer?.username ?? "",
            },
            skip: selectedPlayer === null,
        }
    );

    const playerAccount =
        playerAccountData?.playerAccount ?? null;

    const pointsBalance =
        getDisplayedPointsBalance(
            playerAccount,
            balanceUpdateData
        );

    return {
        players:
            playerChoicesData?.playerChoices ?? [],
        selectedPlayer,
        playerAccount,
        pointsBalance,
        loadingPlayers,
        loadingPlayerAccount,
        playerQueryError,
        playerAccountError,
        subscriptionError,
        selectPlayer: setSelectedPlayer,
    };
}