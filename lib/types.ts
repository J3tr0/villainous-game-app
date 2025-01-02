export interface Villain {
	id: string;
	name: string;
	difficulty: 'easy' | 'medium' | 'hard';
	img?: string;
}

export type GameSettings = {
	numberOfPlayers: number;
	difficulty?: 'easy' | 'medium' | 'hard' | 'all';
};
