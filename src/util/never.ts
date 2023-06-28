export const never = (_: never): never => {
	throw new Error(`Code should've been unreachable`);
};
