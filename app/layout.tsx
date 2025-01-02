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
		<html lang="en">
			<body className={robotoCondensed.variable}>{children}</body>
			<script
				dangerouslySetInnerHTML={{
					__html: `
						if ('serviceWorker' in navigator) {
							window.addEventListener('load', function() {
								navigator.serviceWorker.register('/sw.js');
							});
						}
					`,
				}}
			/>
		</html>
	);
}
