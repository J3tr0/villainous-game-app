import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { UpdateNotification } from '@/components/UpdateNotification';
import { Metadata, Viewport } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';

const robotoCondensed = Roboto_Condensed({
	variable: '--font-roboto-condensed',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Disney Villainous Companion',
	description: 'Companion app for Disney Villainous board game',
	manifest: '/manifest.json',
	icons: {
		apple: [
			{ url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
			{ url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
		],
	},
};

export const viewport: Viewport = {
	themeColor: '#4c1d95',
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="it">
			<body className={robotoCondensed.variable}>
				<div className="relative min-h-screen overflow-hidden">{children}</div>
				<ServiceWorkerRegistration />
				<UpdateNotification />
			</body>
		</html>
	);
}
