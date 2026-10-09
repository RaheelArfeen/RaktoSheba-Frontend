/*
  Audit actions currently written by the backend (see AuditLogService.log
  callers). Anything unknown still renders via the underscore-to-spaces
  fallback, so new backend actions never break the UI.
*/
const ACTION_META: Record<string, { label: string; dot: string }> = {
  VERIFY_REQUEST: { label: "verified a blood request", dot: "bg-mint-strong" },
  CANCEL_REQUEST: { label: "cancelled a blood request", dot: "bg-blush-deep" },
  VERIFY_HOSPITAL: { label: "verified a hospital", dot: "bg-mint-strong" },
  REJECT_HOSPITAL: { label: "rejected a hospital", dot: "bg-blood" },
  ACCEPT_REQUEST: { label: "a donor accepted a request", dot: "bg-peach" },
  FULFILL_REQUEST: { label: "marked a request fulfilled", dot: "bg-forest" },
  WITHDRAW_DONATION: { label: "a donor withdrew from a request", dot: "bg-sand-deep" },
  BAN_USER: { label: "banned an account", dot: "bg-blood" },
  UNBAN_USER: { label: "unbanned an account", dot: "bg-mint" },
};

export const auditActionMeta = (action: string): { label: string; dot: string } =>
  ACTION_META[action] ?? { label: action.toLowerCase().replaceAll("_", " "), dot: "bg-linen" };
