export type TransactionCode = "TRAN" | "ADJ";

export type Transaction = {
    id: string;
    transactioncode: TransactionCode;
    gametype: string | null;
    amountwagered: number | null;
    points_delta: number;
    adjustment_reason: string | null;
    transaction_timestamp: string;
};