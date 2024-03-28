export const Games = {
	UNO: 'UNO'
} as const;
export type GamesType = typeof Games[keyof typeof Games];

export * from './uno.types';