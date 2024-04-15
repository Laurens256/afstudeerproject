export const Games = {
	UNO: 'Chaos Cards'
} as const;
export type GamesType = typeof Games[keyof typeof Games];

export * from './uno.types';