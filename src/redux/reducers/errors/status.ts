type StatusTag = "success" | "pending" | "error";

type SuccessStatus = { tag: "success" };
type PendingStatus = { tag: "pending" };
type ErrorStatus<E> = { tag: "error"; error: E };

export type Status<E> = { tag: StatusTag } & (
	| SuccessStatus
	| PendingStatus
	| ErrorStatus<E>
);
