'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function UpdateNotification() {
	const [showReload, setShowReload] = useState(false);
	const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
		null
	);
	const t = useTranslations();

	useEffect(() => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			// Registra un listener per gli aggiornamenti
			const handleUpdate = (registration: ServiceWorkerRegistration) => {
				if (registration.waiting) {
					setWaitingWorker(registration.waiting);
					setShowReload(true);
				}
			};

			// Controlla se c'è un nuovo service worker
			navigator.serviceWorker.ready.then((registration) => {
				registration.addEventListener('controllerchange', () => {
					window.location.reload();
				});
			});

			// Controlla periodicamente gli aggiornamenti
			const interval = setInterval(() => {
				navigator.serviceWorker.getRegistration().then((registration) => {
					if (registration) {
						registration.update();
					}
				});
			}, 1000 * 60 * 60); // Controlla ogni ora

			navigator.serviceWorker.getRegistration().then((registration) => {
				if (registration) {
					registration.addEventListener('updatefound', () =>
						handleUpdate(registration)
					);
					// Controlla anche lo stato corrente
					if (registration.waiting) {
						handleUpdate(registration);
					}
				}
			});

			return () => clearInterval(interval);
		}
	}, []);

	const reloadPage = () => {
		waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
		setShowReload(false);
		window.location.reload();
	};

	if (!showReload) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 p-4 bg-purple-900 rounded-lg shadow-lg flex items-center gap-4">
			<p className="text-white">{t.newVersionAvailable}</p>
			<Button
				onClick={reloadPage}
				className="bg-white text-purple-900 hover:bg-purple-100">
				{t.updateNow}
			</Button>
		</div>
	);
}
