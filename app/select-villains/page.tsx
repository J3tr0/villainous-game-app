'use client';

import { villains } from '@/data/villains';
import { useTranslations } from '@/hooks/useTranslations';
import type { GameSettings, Villain } from '@/lib/types';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Stili base dei pulsanti estratti per riutilizzo e consistenza
const buttonBaseClass = `
	flex items-center justify-center 
	font-bold transition-all duration-300 ease-in-out
	transform hover:scale-105
	hover:shadow-lg hover:-translate-y-1
	active:scale-95
`;

const actionButtonClass = `
	${buttonBaseClass}
	px-8 py-3 rounded-lg
	text-white
`;

function SelectVillainsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const numberOfPlayers = Number(searchParams.get('players')) || 2;
	const difficulty =
		(searchParams.get('difficulty') as GameSettings['difficulty']) || 'all';

	const [assignedVillains, setAssignedVillains] = useState<Villain[]>([]);
	const [usedVillains, setUsedVillains] = useState<Set<string>>(new Set());
	const [startingPlayer, setStartingPlayer] = useState<number | null>(null);

	const t = useTranslations();

	const handleBack = async () => {
		try {
			setIsLoading(true);
			await router.back();
		} catch (error) {
			console.error('Navigation error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const getNewVillain = (currentVillain: Villain) => {
		if (!currentVillain) return null;

		const currentlyAssignedIds = new Set(assignedVillains.map((v) => v.id));
		const availableVillains = villains.filter(
			(v) => !usedVillains.has(v.id) && !currentlyAssignedIds.has(v.id)
		);

		let newVillain = null;

		switch (currentVillain.difficulty) {
			case 'hard':
				newVillain = availableVillains.find((v) => v.difficulty === 'hard');
				if (!newVillain) {
					newVillain = availableVillains.find((v) => v.difficulty === 'medium');
				}
				if (!newVillain) {
					newVillain = availableVillains.find((v) => v.difficulty === 'easy');
				}
				break;

			case 'medium':
				newVillain = availableVillains.find((v) => v.difficulty === 'medium');
				if (!newVillain) {
					newVillain = availableVillains.find((v) => v.difficulty === 'easy');
				}
				break;

			case 'easy':
				newVillain = availableVillains.find((v) => v.difficulty === 'easy');
				break;
		}

		return newVillain;
	};

	const handleReplaceVillain = (villainToReplace: Villain) => {
		if (!villainToReplace) return;

		const newVillain = getNewVillain(villainToReplace);

		if (newVillain) {
			setUsedVillains((prev) => new Set([...prev, villainToReplace.id]));
			setAssignedVillains((prev) =>
				prev.map((v) => (v.id === villainToReplace.id ? newVillain : v))
			);
		}
	};

	const isVillainReplaceable = (villain: Villain) => {
		const currentlyAssignedIds = new Set(assignedVillains.map((v) => v.id));
		const availableVillains = villains.filter(
			(v) => !usedVillains.has(v.id) && !currentlyAssignedIds.has(v.id)
		);

		switch (villain.difficulty) {
			case 'hard':
				return availableVillains.some(
					(v) =>
						v.difficulty === 'hard' ||
						v.difficulty === 'medium' ||
						v.difficulty === 'easy'
				);
			case 'medium':
				return availableVillains.some(
					(v) => v.difficulty === 'medium' || v.difficulty === 'easy'
				);
			case 'easy':
				return availableVillains.some((v) => v.difficulty === 'easy');
			default:
				return false;
		}
	};

	const handleStart = () => {
		const randomPlayerIndex = Math.floor(
			Math.random() * assignedVillains.length
		);
		setStartingPlayer(randomPlayerIndex);
	};

	useEffect(() => {
		if (!numberOfPlayers || !difficulty) return;

		const availableVillains =
			difficulty === 'all'
				? villains
				: villains.filter((v) => v.difficulty === difficulty);

		if (availableVillains.length === 0) return;

		const shuffledVillains = [...availableVillains]
			.sort(() => Math.random() - 0.5)
			.slice(0, numberOfPlayers);

		setAssignedVillains(shuffledVillains);
		setUsedVillains(new Set(shuffledVillains.map((v) => v.id)));
	}, [difficulty, numberOfPlayers]);

	if (!assignedVillains.length) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 p-5 flex items-center justify-center animate-fadeIn">
				<div className="animate-spin w-8 h-8 border-3 border-white/20 border-t-white rounded-full" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 p-5">
			<div className="max-w-7xl mx-auto animate-fadeIn">
				<h1 className="text-2xl text-white font-bold text-center mb-8">
					{startingPlayer === null ? t.selectYourVillains : t.gameOrder}
				</h1>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
					{assignedVillains.map((villain, index) => (
						<div
							key={`${villain.id}`}
							className={`
								flex flex-col transform
								transition-all duration-300
								hover:scale-105
								${villain.id !== assignedVillains[index]?.id ? 'animate-flip' : ''}
							`}>
							<div
								className={`
									relative aspect-square rounded-xl overflow-hidden
										shadow-xl transition-all duration-300
										${
											startingPlayer !== null && index === startingPlayer
												? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-transparent scale-105'
												: ''
										}
								`}>
								<Image
									src={villain.img || '/placeholder-villain.jpg'}
									alt={villain.name}
									fill
									className="object-cover"
									priority={index < 4}
								/>
							</div>
							<div className="text-center mt-3 space-y-1">
								{startingPlayer !== null && (
									<p className="text-white font-bold text-lg animate-fadeIn">
										{index === startingPlayer
											? t.firstPlayer
											: `${t.player} ${
													((index - startingPlayer + assignedVillains.length) %
														assignedVillains.length) +
													1
											  }`}
									</p>
								)}
								<p className="text-white/90 font-semibold">{villain.name}</p>
								{startingPlayer === null && (
									<button
										onClick={() => handleReplaceVillain(villain)}
										disabled={!isVillainReplaceable(villain)}
										className={`
											mt-2 p-2 rounded-full
											transition-all duration-300
											${
												isVillainReplaceable(villain)
													? 'bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 hover:scale-110'
													: 'bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed opacity-50'
											}
										`}
										title={
											isVillainReplaceable(villain)
												? t.dontHaveVillain
												: t.noMoreVillains
										}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
											/>
										</svg>
									</button>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 flex justify-center gap-4">
					<button
						onClick={handleBack}
						disabled={isLoading}
						className={`
							${actionButtonClass}
							bg-white/10 border border-white/20
							hover:bg-white/20
						`}>
						{t.backToSettings}
					</button>

					<button
						onClick={handleStart}
						disabled={startingPlayer !== null || isLoading}
						className={`
							${actionButtonClass}
							bg-gradient-to-r from-purple-600 to-pink-600
							hover:from-purple-500 hover:to-pink-500
							disabled:opacity-50 disabled:cursor-not-allowed
							disabled:hover:scale-100 disabled:hover:translate-y-0
						`}>
						{startingPlayer === null ? t.startGame : t.gameStarted}
					</button>
				</div>
			</div>
		</div>
	);
}

export default function SelectVillains() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 p-5 flex items-center justify-center">
					<div className="animate-spin w-8 h-8 border-3 border-white/20 border-t-white rounded-full" />
				</div>
			}>
			<SelectVillainsContent />
		</Suspense>
	);
}
