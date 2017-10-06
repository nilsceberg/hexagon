export interface Transaction {
	fromId: string;
	toId: string;
	amountToTransfer: number;
}

export interface Cell {
	resources: number;
	neighbours: Neighbour[];
	id: string;
}

export interface Neighbour {
	owner: number;
	resources: number;
	id: string;
}

export type BoardState = Cell[];

export type Strategy = (state: BoardState) => Transaction;
