export class TransactionEvent {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
  ) { }
}