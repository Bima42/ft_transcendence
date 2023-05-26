import { getCookie } from 'typescript-cookie';

export class BackendError extends Error {
	public statusCode: number
	public error: string

	constructor(message: string, statusCode: number = 500, error: string = ""){
		super(message)
		this.statusCode = statusCode
		this.error = error
	}
}

export const jsonHeaders = new Headers({
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Bearer ${getCookie(import.meta.env.VITE_JWT_COOKIE)}`
})

export const mediaHeaders = new Headers({
	'Accept': 'application/json',
	'Authorization': `Bearer ${getCookie(import.meta.env.VITE_JWT_COOKIE)}`
})

export async function post(
	route: string,
	message: string,
	headers: Headers = jsonHeaders,
	body?: Object,
	file?: FormData
): Promise<any> {
	const request: RequestInit = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		headers: headers,
	}
	if (body)
		request.body = JSON.stringify(body)
	else if (file)
		request.body = file
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${route}`, request)
		.catch(() => { throw new BackendError("Cannot connect to server", 500) })
	const jsonBody = await response.json().catch(() => {})
	if (!response.ok) {
		throw new BackendError(jsonBody.message ?? message, response.status, jsonBody.error ?? "")
	}
	return jsonBody
}

/**
 *
 * @param route : string, the route to fetch
 * @param message : string, the message to display if the request fails
 * @param headers : Headers, the headers to send with the request
 *
 * @header Cookie is not printable because of httpOnly true
 */
export async function get(
	route: string,
	message: string,
	headers: Headers = jsonHeaders
) {
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${route}`, {
		method: 'GET',
		headers: headers,
	})
		.catch(() => { throw new BackendError("Cannot connect to server", 500) })
	const jsonBody = await response.json().catch(() => {})
	if (!response.ok) {
		throw new BackendError(jsonBody.message ?? message, response.status, jsonBody.error ?? "")
	}
	return jsonBody
}

/**
* @brief Execute a DELETE request on the backend
*
* @param route: the route to delete
* @param message: string, the message to display if the request fails
* @param headers: Headers, the headers to send with the request
*
* @return
*/
export async function del(
	route: string,
	message: string,
	headers: Headers = jsonHeaders,
	body?: Object,
): Promise<any> {
	const request: RequestInit = {
		method: 'DELETE',
		mode: 'cors',
		credentials: 'include',
		headers: headers,
	}
	if (body)
		request.body = JSON.stringify(body)
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${route}`, request)
		.catch(() => { throw new BackendError("Cannot connect to server", 500) })
	const jsonBody = await response.json().catch(() => {})
	if (!response.ok) {
		throw new BackendError(jsonBody.message ?? message, response.status, jsonBody.error ?? "")
	}
	return jsonBody
}

/**
* @brief Execute a PUT request on the backend
*
* @param route: the route to delete
* @param message: string, the message to display if the request fails
* @param headers: Headers, the headers to send with the request
* @param body: the datas to send in the request body
*
* @return
*/
export async function put(
	route: string,
	message: string,
	headers: Headers = jsonHeaders,
	body?: Object,
): Promise<any> {
	const request: RequestInit = {
		method: 'PUT',
		mode: 'cors',
		credentials: 'include',
		headers: headers,
	}
	if (body)
		request.body = JSON.stringify(body)
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${route}`, request)
		.catch(() => { throw new BackendError("Cannot connect to server", 500) })
	const jsonBody = await response.json().catch(() => {})
	if (!response.ok) {
		throw new BackendError(jsonBody.message ?? message, response.status, jsonBody.error ?? "")
	}
	return jsonBody
}

export async function patch(
	route: string,
	message: string,
	headers: Headers = jsonHeaders,
	json?: Object
): Promise<any> {
	const request: RequestInit = {
		method: 'PATCH',
		mode: 'cors',
		credentials: 'include',
		headers: headers,
	}
	if (json)
		request.body = JSON.stringify(json)
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${route}`, request)
		.catch(() => { throw new BackendError("Cannot connect to server", 500) })
	const jsonBody = await response.json().catch(() => {})
	if (!response.ok) {
		throw new BackendError(jsonBody.message ?? message, response.status, jsonBody.error ?? "")
	}
	return jsonBody
}

export function roundValue(value: number, decimals: number): number {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}
