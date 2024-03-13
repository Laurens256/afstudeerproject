export const Games = {
	UNO: 'uno'
} as const;
export type GamesType = typeof Games[keyof typeof Games];

export * from './uno.types';