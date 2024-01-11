export interface DDBTableKeyAttrs {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly LSI: string;
  readonly LSI2: string;
  readonly GSI_SK: string;
  readonly GSI2: string;
  readonly GSI2_SK: string;
}

export interface LSILastEvaluatedKey {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly LSI: string;
}

export interface LSI2LastEvaluatedKey {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly LS2: string;
}

export interface GSILastEvaluatedKey {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly GSI_SK: string;
}

export interface GSI2LastEvaluatedKey {
  readonly PK: string;
  readonly GSI2: string;
  readonly GSI2_SK: string;
}

export type TransformerParams<T> = {
  [key in keyof DDBTableKeyAttrs]?: {
    fields?: (keyof T)[];
    compose: (params: { [key in keyof T]?: T[key] }) => string;
    destruct?: (key: string) => { [key in keyof T]?: T[key] };
  };
};
