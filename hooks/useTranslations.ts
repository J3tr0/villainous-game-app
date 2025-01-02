'use client';

import en from '@/messages/en';
import es from '@/messages/es';
import fr from '@/messages/fr';
import it from '@/messages/it';
import { useEffect, useState } from 'react';

const messages = { en, it, fr, es };
type Language = keyof typeof messages;

export function useTranslations() {
	const [lang, setLang] = useState<Language>('en');

	useEffect(() => {
		const browserLang = navigator.language.split('-')[0] as Language;
		setLang(messages[browserLang] ? browserLang : 'en');
	}, []);

	return messages[lang];
}
