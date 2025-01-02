'use client';

import { useTranslations } from '@/hooks/useTranslations';
import type { GameSettings } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
	const router = useRouter();
	const [gameSettings, setGameSettings] = useState<GameSettings>({
		numberOfPlayers: 2,
		difficulty: 'easy',
	});
	const t = useTranslations();

	const handlePlayerCountChange = (value: number) => {
		setGameSettings((prev) => ({
			...prev,
			numberOfPlayers: value,
		}));
	};

	const handleDifficultyChange = (value: GameSettings['difficulty']) => {
		setGameSettings((prev) => ({
			...prev,
			difficulty: value,
		}));
	};

	const handleStartGame = () => {
		router.push(
			`/select-villains?players=${gameSettings.numberOfPlayers}&difficulty=${gameSettings.difficulty}`
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 p-5">
			<div className="flex flex-col items-center gap-12 mt-8 animate-fadeIn">
				<div className="relative group">
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
										w-14 h-14 rounded-lg 
										flex items-center justify-center 
										text-lg font-bold transition-all duration-300
										hover:shadow-lg hover:-translate-y-1
										${
											gameSettings.numberOfPlayers === num
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
						<div className="flex justify-center gap-4 px-8">
							{['easy', 'medium', 'hard'].map((diff) => (
								<button
									key={diff}
									onClick={() =>
										handleDifficultyChange(diff as GameSettings['difficulty'])
									}
									className={`
										px-4 py-2 rounded-xl
										flex items-center justify-center 
										text-base font-bold transition-all duration-300
										hover:shadow-lg hover:-translate-y-1
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
					</div>

					<div className="pt-4">
						<button
							onClick={handleStartGame}
							disabled={!gameSettings.difficulty}
							className="w-full py-4 rounded-xl
								bg-gradient-to-r from-purple-600 to-pink-600
								hover:from-purple-500 hover:to-pink-500
								text-white text-xl font-bold
								transform transition-all duration-300
								hover:scale-[1.02] hover:shadow-xl
								active:scale-[0.98]
								disabled:opacity-50 disabled:cursor-not-allowed
								group relative overflow-hidden">
							<div className="absolute inset-0 w-full h-full bg-white/20 group-hover:animate-shimmer" />
							<span className="relative flex items-center justify-center gap-2">
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
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
