'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showInstallButton, setShowInstallButton] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			// Previene il popup automatico di Chrome
			e.preventDefault();
			// Cast dell'evento al tipo corretto
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			// Mostra il nostro pulsante personalizzato
			setShowInstallButton(true);
		};

		window.addEventListener('beforeinstallprompt', handler);

		// Controlla se l'app è già installata
		if (window.matchMedia('(display-mode: standalone)').matches) {
			setShowInstallButton(false);
		}

		return () => window.removeEventListener('beforeinstallprompt', handler);
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// Mostra il prompt di installazione
		deferredPrompt.prompt();

		// Aspetta che l'utente risponda al prompt
		const { outcome } = await deferredPrompt.userChoice;

		// Abbiamo usato il prompt, non possiamo riusarlo, lo resettiamo
		setDeferredPrompt(null);

		// Nascondi il pulsante
		if (outcome === 'accepted') {
			setShowInstallButton(false);
		}
	};

	if (!showInstallButton) return null;

	return (
		<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 animate-slideUpAndFade">
			<div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-white/20 hover:bg-white/15 transition-colors">
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1">
						<p className="text-white font-medium">
							nstalla l&apos;app per un&apos;esperienza migliore
						</p>
						<p className="text-white/70 text-sm">
							Accedi rapidamente e gioca offline
						</p>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => setShowInstallButton(false)}
							aria-label="Chiudi prompt di installazione"
							className="px-3 py-2 rounded-md text-white/70 hover:text-white transition-colors">
							Dopo
						</button>
						<button
							onClick={handleInstallClick}
							className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none">
							<span className="flex items-center gap-2">
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
										d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
									/>
								</svg>
								Installa
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
