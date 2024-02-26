import { API_URL } from '@/app.constants';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

class ApiClient {
	private baseUrl: string;
	constructor() {
		this.baseUrl = API_URL;
	}

	async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		return await (
			await fetch(url, {
				credentials: 'include',
				...options
			})
		).json();
	}

	async post<T>(endpoint: string, data: any = {}): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		return await (await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})).json();
	}
}

export default new ApiClient();
