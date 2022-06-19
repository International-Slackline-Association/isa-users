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

export type TransformerParams<T> = {
  [key in keyof DDBTableKeyAttrs]?: {
    fields?: (keyof T)[];
    compose: (params: { [key in keyof T]?: T[key] }) => string;
    destruct?: (key: string) => { [key in keyof T]?: T[key] };
  };
};
