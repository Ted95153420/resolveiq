import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import EmptyTransactionList from "./EmptyTransactionList";
import TransactionListHeader from "./TransactionListHeader";
import TransactionListItem from "./TransactionListItem";
import type { Transaction } from "./transactionTypes";

type UserTransactionListingProps = {
    transactions: Transaction[];
};

function UserTransactionListing({ transactions }: UserTransactionListingProps) {
    if (!transactions || transactions.length === 0) {
        return <EmptyTransactionList />;
    }

    return (
        <Paper
            elevation={0}
            sx={{
                m: 2,
                borderRadius: 2,
                backgroundColor: "#f8fbff",
                border: "1px solid #dbe7f3",
                overflow: "hidden",
            }}
        >
            <TransactionListHeader
                transactionCount={transactions.length}
            />

            <List disablePadding>
                {transactions.map((transaction, index) => (
                    <TransactionListItem
                        key={transaction.id}
                        transaction={transaction}
                        showDivider={index < transactions.length - 1}
                        alternateBackground={index % 2 !== 0}
                    />
                ))}   
            </List>
        </Paper>
    );
}

export default UserTransactionListing;