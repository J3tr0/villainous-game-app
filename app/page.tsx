'use client';

import { useTranslations } from '@/hooks/useTranslations';
import type { GameSettings } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Stili base dei pulsanti estratti per riutilizzo e consistenza
const buttonBaseClass = `
	flex items-center justify-center 
	font-bold transition-all duration-300 ease-in-out
	transform hover:scale-105
	hover:shadow-lg hover:-translate-y-1
	active:scale-95
`;

const difficultyButtonClass = `
	${buttonBaseClass}
	px-4 py-2 rounded-xl text-base
`;

const playerCountButtonClass = `
	${buttonBaseClass}
	w-12 h-12 rounded-lg text-lg
`;

const startButtonClass = `
	${buttonBaseClass}
	w-full py-4 rounded-xl text-xl
	bg-gradient-to-r from-purple-600 to-pink-600
	hover:from-purple-500 hover:to-pink-500
	text-white
	disabled:opacity-50 disabled:cursor-not-allowed
	disabled:hover:scale-100 disabled:hover:translate-y-0
`;

export default function Home() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [gameSettings, setGameSettings] = useState<GameSettings>({
		players: 2,
		difficulty: 'all',
	});
	const t = useTranslations();

	const handlePlayerCountChange = (value: number) => {
		setGameSettings((prev) => ({
			...prev,
			players: value,
		}));
	};

	const handleDifficultyChange = (value: GameSettings['difficulty']) => {
		setGameSettings((prev) => ({
			...prev,
			difficulty: value,
		}));
	};

	const handleStartGame = async () => {
		try {
			setIsLoading(true);
			await router.push(
				`/select-villains?players=${gameSettings.players}&difficulty=${gameSettings.difficulty}`
			);
		} catch (error) {
			console.error('Navigation error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 p-5">
			<div className="flex flex-col items-center gap-12 mt-8 animate-fadeIn">
				<div className="relative group cursor-pointer">
					<Image
						src="/logo-disney-villainous-dark.png"
						alt="Logo Disney Villainous"
						width={250}
						height={125}
						className="drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
						priority
					/>
				</div>

				<div className="w-full max-w-md space-y-10 backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10">
					<div>
						<label className="text-xl font-bold text-center block mb-6 text-white/90 tracking-wide">
							{t.numberOfPlayers}
						</label>
						<div className="flex justify-center gap-4">
							{[2, 3, 4, 5, 6].map((num) => (
								<button
									key={num}
									onClick={() => handlePlayerCountChange(num)}
									className={`
										${playerCountButtonClass}
										${
											gameSettings.players === num
												? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 shadow-lg'
												: 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
										}
									`}>
									{num}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="text-xl font-bold text-center block mb-6 text-white/90 tracking-wide">
							{t.difficultyLevel}
						</label>
						<div className="flex flex-col items-center gap-4">
							<div className="grid grid-cols-2 md:flex justify-center gap-4">
								{['green', 'yellow', 'orange', 'red'].map((diff) => (
									<button
										key={diff}
										onClick={() =>
											handleDifficultyChange(diff as GameSettings['difficulty'])
										}
										className={`
											${difficultyButtonClass}
											w-full md:w-auto
											${
												gameSettings.difficulty === diff
													? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105 shadow-lg'
													: 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
											}
										`}>
										{t[diff as keyof typeof t]}
									</button>
								))}
							</div>
							<button
								onClick={() => handleDifficultyChange('all')}
								className={`
									${difficultyButtonClass}
									w-full md:w-auto
									${
										gameSettings.difficulty === 'all'
											? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105 shadow-lg'
											: 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
									}
								`}>
								{t.all}
							</button>
						</div>
					</div>

					<div className="pt-4">
						<button
							onClick={handleStartGame}
							disabled={isLoading}
							className={startButtonClass}>
							<span className="relative flex items-center justify-center gap-2">
								{isLoading ? (
									<div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full" />
								) : (
									<>
										{t.startGame}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 transition-transform group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 7l5 5m0 0l-5 5m5-5H6"
											/>
										</svg>
									</>
								)}
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
