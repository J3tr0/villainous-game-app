import { villains } from '@/data/villains';

// restituiamo il nome del villain a partire dall'id
export const getVillainName = (id: string) => {
	const villain = villains.find((villain) => villain.id === id);
	return villain ? villain.name : null;
};

// restituiamo l'immagine del villain a partire dall'id
export const getVillainImg = (id: string) => {
	const villain = villains.find((villain) => villain.id === id);
	return villain ? villain.img : null;
};
