import {
    screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
    danInitialAccountMock,
    danInitialSubscriptionMock,
    danLiveBalanceUpdateMock,
    danReselectedAccountMock,
    danReselectedSubscriptionMock,
    miaAccountMock,
    miaBalanceSubscriptionMock,
    playerChoicesMock,
} from "./playerSimulatorMocks";

import {
    expectDisplayedPointsBalance,
    expectDisplayedPointsBalanceNotToBe,
    renderPlayerSimulator,
    selectPlayer,
} from "./playerSimulatorTestHelpers";

describe("PlayerSimulatorPage", () => {
    it("loads the available players", async () => {
        renderPlayerSimulator({
            mocks: [
                playerChoicesMock,
            ],
        });

        expect(
            screen.getByRole("heading", {
                name: "Player Simulator",
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByRole("combobox", {
                name: "Select a player",
            })
        ).toBeInTheDocument();
    });

    it("displays the authoritative account balance when a player is selected", async () => {
        const user = userEvent.setup();

        renderPlayerSimulator({
            mocks: [
                playerChoicesMock,
                danInitialAccountMock,
                danInitialSubscriptionMock,
            ],
        });

        await selectPlayer(user, {
            searchText: "Dan",
            optionLabel: "Dan Smith — DSmith",
        });

        /*
         * playerChoices deliberately says Dan has only
         * 100 points. The authoritative playerAccount
         * query says he has 1,000.
         */
        await expectDisplayedPointsBalance(1000);
        expectDisplayedPointsBalanceNotToBe(100);
    });

    it("updates the displayed balance when a subscription event is received", async () => {
        const user = userEvent.setup();

        renderPlayerSimulator({
            mocks: [
                playerChoicesMock,
                danInitialAccountMock,
                danLiveBalanceUpdateMock,
            ],
        });

        await selectPlayer(user, {
            searchText: "Dan",
            optionLabel: "Dan Smith — DSmith",
        });

        /*
         * The account query supplies the initial
         * authoritative balance.
         */
        await expectDisplayedPointsBalance(1000);

        /*
         * The delayed subscription event then supplies
         * Dan's newly adjusted balance.
         */
        await expectDisplayedPointsBalance(1500);
    });

    it("displays the authoritative balance after an adjusted player is reselected", async () => {
        const user = userEvent.setup();

        renderPlayerSimulator({
            mocks: [
                playerChoicesMock,

                // First Dan selection
                danInitialAccountMock,
                danLiveBalanceUpdateMock,

                // Mia selection
                miaAccountMock,
                miaBalanceSubscriptionMock,

                // Dan selected again
                danReselectedAccountMock,
                danReselectedSubscriptionMock,
            ],
        });

        /*
         * Dan's authoritative account balance starts
         * at 1,000 points.
         */
        await selectPlayer(user, {
            searchText: "Dan",
            optionLabel: "Dan Smith — DSmith",
        });

        await expectDisplayedPointsBalance(1000);

        /*
         * A subscription event reports that Dan's
         * adjusted balance is now 1,500.
         */
        await expectDisplayedPointsBalance(1500);

        /*
         * Switch away from Dan and select Mia.
         */
        await selectPlayer(user, {
            searchText: "Mia",
            optionLabel: "Mia Cooper — MCooper",
        });

        await expectDisplayedPointsBalance(500);

        /*
         * Reselect Dan. This must trigger another
         * authoritative playerAccount query.
         */
        await selectPlayer(user, {
            searchText: "Dan",
            optionLabel: "Dan Smith — DSmith",
        });

        await expectDisplayedPointsBalance(1500);

        /*
         * The autocomplete data still contains Dan's
         * deliberately stale balance of 100 points.
         *
         * This assertion protects against the original
         * bug returning.
         */
        expectDisplayedPointsBalanceNotToBe(100);
    });
});