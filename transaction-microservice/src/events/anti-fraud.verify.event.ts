export class AntiFraudVerifyEvent {
  constructor(
    public readonly transactionExternalId: string,
    public readonly value: number,
  ) { }

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      value: this.value,
    });
  }
}