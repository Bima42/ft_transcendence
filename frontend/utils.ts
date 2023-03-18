import { getCookie } from 'typescript-cookie';

export async function post(
	route: string,
	message: string,
	json: Record<string, unknown> = {},
): Promise<Response> {
	const request: RequestInit = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		headers: new Headers({
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		}),
	}
	if (json)
		request.body = JSON.stringify(json)
	const response = await fetch(`https://localhost:4443/api/${route}`, request)
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}

/**
 *
 * @param route : string, the route to fetch
 * @param message : string, the message to display if the request fails
 *
 * @header Cookie is not printable because of httpOnly true
 */
export async function get(route: string, message: string): Promise<Response> {
	const response = await fetch(`https://localhost:4443/api/${route}`, {
		method: 'GET',
		credentials: 'include',
		headers: new Headers({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${getCookie('access_token')}`
		}),
	})
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}

export async function del(route: string, message: string): Promise<Response> {
	const response = await fetch(`https://localhost:4443/api/${route}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}
