export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(amount);
}

export function formatDate(timestamp: string) {
    return new Date(timestamp).toLocaleString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatPointsDelta(pointsDelta: number) {
    return pointsDelta > 0
        ? `+${pointsDelta} points`
        : `${pointsDelta} points`;
}