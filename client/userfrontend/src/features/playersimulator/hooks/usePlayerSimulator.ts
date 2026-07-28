import { useState } from "react";

import {
    useQuery,
    useSubscription,
} from "@apollo/client/react";

import {
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
    selectedPlayer: PlayerChoice | null,
    balanceUpdateData: PlayerBalanceUpdatedData | undefined
): number | undefined {
    if (!selectedPlayer) {
        return undefined;
    }

    const balanceUpdate =
        balanceUpdateData?.playerBalanceUpdated;

    if (
        balanceUpdate &&
        balanceUpdate.username === selectedPlayer.username
    ) {
        return balanceUpdate.loyaltypointbalance;
    }

    return selectedPlayer.loyaltypointbalance;
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

    const pointsBalance =
        getDisplayedPointsBalance(
            selectedPlayer,
            balanceUpdateData
        );

    return {
        players:
            playerChoicesData?.playerChoices ?? [],
        selectedPlayer,
        pointsBalance,
        loadingPlayers,
        playerQueryError,
        subscriptionError,
        selectPlayer: setSelectedPlayer,
    };
}