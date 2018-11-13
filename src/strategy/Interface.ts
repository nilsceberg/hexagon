export interface Transaction {
	fromId: string;
	toId: string;
	amountToTransfer: number;
}

export interface MyCell {
	resources: number;
	neighbours: NeighbourCell[];
	id: string;
}

export interface NeighbourCell {
	owner: number;
	resources: number;
	id: string;
}

export type BoardState = MyCell[];

export type Strategy = (state: BoardState) => Transaction;
