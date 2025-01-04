'use client';

import { useState } from 'react';

export function ClearCacheButton() {
	const [isClearing, setIsClearing] = useState(false);

	const handleClearCache = async () => {
		try {
			setIsClearing(true);

			// Pulisce la cache del service worker
			if ('serviceWorker' in navigator) {
				const registrations = await navigator.serviceWorker.getRegistrations();
				await Promise.all(
					registrations.map((registration) => registration.unregister())
				);
			}

			// Pulisce la cache del browser
			if ('caches' in window) {
				const cacheNames = await caches.keys();
				await Promise.all(cacheNames.map((name) => caches.delete(name)));
			}

			// Ricarica la pagina per applicare le modifiche
			window.location.reload();
		} catch (error) {
			console.error('Errore durante la pulizia della cache:', error);
		} finally {
			setIsClearing(false);
		}
	};

	return (
		<button
			onClick={handleClearCache}
			disabled={isClearing}
			className="px-4 py-2 bg-red-500/20 text-red-200 border border-red-500/30 
        rounded-lg transition-all duration-300 hover:bg-red-500/30 
        flex items-center gap-2 disabled:opacity-50">
			{isClearing ? (
				<div className="animate-spin w-4 h-4 border-2 border-red-200/20 border-t-red-200 rounded-full" />
			) : (
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
			)}
			{isClearing ? 'Pulizia in corso...' : 'Pulisci cache'}
		</button>
	);
}
