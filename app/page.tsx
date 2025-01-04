'use client';

import { useTranslations } from '@/hooks/useTranslations';
import type { GameSettings } from '@/lib/types';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Importazione dinamica del ClearCacheButton
const ClearCacheButton = dynamic(
	() =>
		import('@/components/ClearCacheButton').then((mod) => mod.ClearCacheButton),
	{ ssr: false } // Disabilita il server-side rendering
);

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
		numberOfPlayers: 2,
		difficulty: 'all',
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

	const handleStartGame = async () => {
		try {
			setIsLoading(true);
			await router.push(
				`/select-villains?players=${gameSettings.numberOfPlayers}&difficulty=${gameSettings.difficulty}`
			);
		} catch (error) {
			console.error('Navigation error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-800 p-5">
			<div className="fixed top-4 right-4">
				<div className="relative group">
					<button
						className="p-2 rounded-full bg-white/10 hover:bg-white/20 
							transition-all duration-300 hover:scale-105
							border border-white/20"
						aria-label="Impostazioni">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 text-white">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</button>

					<div
						className="absolute right-0 mt-2 w-48 invisible group-hover:visible 
						opacity-0 group-hover:opacity-100 transition-all duration-300">
						<div
							className="bg-white/10 backdrop-blur-lg rounded-lg p-2 
							shadow-lg border border-white/20">
							<ClearCacheButton />
						</div>
					</div>
				</div>
			</div>

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
						<div className="flex flex-col items-center gap-4">
							<div className="flex justify-center gap-4">
								{['easy', 'medium', 'hard'].map((diff) => (
									<button
										key={diff}
										onClick={() =>
											handleDifficultyChange(diff as GameSettings['difficulty'])
										}
										className={`
											${difficultyButtonClass}
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
									px-8
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
