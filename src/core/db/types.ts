export interface DDBTableKeyAttrs {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly LSI: string;
  readonly GSI_SK: string;
}

export interface LSILastEvaluatedKey {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly LSI: string;
}

export interface GSILastEvaluatedKey {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly GSI_SK: string;
}
