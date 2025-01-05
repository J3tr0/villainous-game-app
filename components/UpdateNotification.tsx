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
			// Controlla immediatamente se c'è un service worker in attesa
			navigator.serviceWorker.getRegistration().then((registration) => {
				if (registration) {
					if (registration.waiting) {
						setWaitingWorker(registration.waiting);
						setShowReload(true);
					}

					// Ascolta i nuovi service worker
					registration.addEventListener('updatefound', () => {
						const newWorker = registration.installing;
						if (newWorker) {
							newWorker.addEventListener('statechange', () => {
								if (
									newWorker.state === 'installed' &&
									navigator.serviceWorker.controller
								) {
									setWaitingWorker(newWorker);
									setShowReload(true);
								}
							});
						}
					});
				}
			});

			// Controlla gli aggiornamenti ogni minuto
			const interval = setInterval(() => {
				navigator.serviceWorker.getRegistration().then((registration) => {
					if (registration) {
						registration.update();
					}
				});
			}, 60000); // 1 minuto

			return () => clearInterval(interval);
		}
	}, []);

	const reloadPage = () => {
		if (waitingWorker) {
			waitingWorker.postMessage({ type: 'SKIP_WAITING' });
		}
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
