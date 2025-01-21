export type Difficulty = 'green' | 'yellow' | 'orange' | 'red';

export interface GameSettings {
	players: number;
	difficulty: 'all' | Difficulty;
}

export interface Villain {
	id: string;
	name: string;
	difficulty: Difficulty;
	img: string;
}
