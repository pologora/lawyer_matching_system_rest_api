// eslint-disable-next-line no-shadow
export enum CasesStatusEnum {
  Open = 'open',
  Closed = 'closed',
  Pending = 'pending',
}

export type CasesStatus = keyof typeof CasesStatusEnum;
