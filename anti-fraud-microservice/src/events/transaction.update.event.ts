export class TransactionUpdateEvent {
  constructor(
    public readonly transactionExternalId: string,
    public readonly transactionStatus: string,
  ) { }

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      transactionStatus: this.transactionStatus,
    });
  }
}