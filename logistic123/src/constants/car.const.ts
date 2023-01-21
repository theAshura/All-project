export const CAR_STATUS = {
  Draft: 'Draft',
  Open: 'Open',
  Waiting: 'Waiting',
  Accepted: 'Accepted',
  Submitted: 'Submitted',
  Denied: 'Denied',
  Closed: 'Closed',
  Holding: 'Holding',
  Pending: 'Pending',
};

export enum CarVerificationStatusEnum {
  PENDING = 'Pending',
  HOLDING = 'Holding',
  VERIFIED_AND_CLOSE = 'VerifiedAndClose',
  OVERRIDING_CLOSURE = 'OverridingClosure',
}
