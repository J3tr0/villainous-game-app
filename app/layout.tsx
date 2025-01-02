import type { Metadata } from 'next';
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
	themeColor: '#4c1d95',
	viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head />
			<body className={`${robotoCondensed.variable} antialiased`}>
				{children}
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
			</body>
		</html>
	);
}
