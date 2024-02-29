export enum RoutePath {
	Home = '/',
	Room = '/room/:roomCode',
}

export const generateRoute = (path: RoutePath, params?: Record<string, string>) => {
	let newPath = path;
	if (params) {
		Object.entries(params).forEach(([paramKey, paramValue]) => {
			newPath = newPath.replace(`:${paramKey}`, paramValue) as RoutePath;
		});
	}
	return newPath;
};

type RouteConfig = {
	[key in RoutePath]: {
		hasSocket: boolean;
	};
};

export const RoutesConfig: RouteConfig = {
	[RoutePath.Home]: {
		hasSocket: true,
	},
	[RoutePath.Room]: {
		hasSocket: true,
	},
} as const;
