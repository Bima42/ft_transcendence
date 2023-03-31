import { getCookie } from 'typescript-cookie';

const headers = new Headers({
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${getCookie(import.meta.env.VITE_JWT_COOKIE)}`
		})

export async function post(
	route: string,
	message: string,
	json: Record<string, unknown> = {},
): Promise<Response> {
	const request: RequestInit = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		headers: headers,
  }
	if (json)
		request.body = JSON.stringify(json)
	const response = await fetch(`https://${import.meta.env.VITE_BACKEND_URL}/${route}`, request)
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
	const response = await fetch(`https://${import.meta.env.VITE_BACKEND_URL}/${route}`, {
		method: 'GET',
		headers: headers,
	})
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}

/**
* @brief Execute a DELETE request on the backend
*
* @param route: the route to delete
* @param message: string, the message to display if the request fails
*
  * @return
*/
export async function del(route: string, message: string): Promise<Response> {
	const response = await fetch(`https://${import.meta.env.VITE_BACKEND_URL}/${route}`, {
		method: 'DELETE',
    headers: headers
	})
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}

/**
* @brief Execute a PUT request on the backend
*
* @param route: the route to delete
* @param message: string, the message to display if the request fails
* @param json: the json to send in the body
*
  * @return
*/
export async function put(
	route: string,
	message: string,
	json: Record<string, unknown> = {},
): Promise<Response> {
	const request: RequestInit = {
		method: 'PUT',
		mode: 'cors',
		credentials: 'include',
		headers: headers,
  }
	if (json)
		request.body = JSON.stringify(json)
	const response = await fetch(`https://${import.meta.env.VITE_BACKEND_URL}/${route}`, request)
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}

export async function patch(
	route: string,
	message: string,
	json: Record<string, unknown>
): Promise<Response> {
	const request: RequestInit = {
		method: 'PATCH',
		headers: headers,
	}
	if (json)
		request.body = JSON.stringify(json)
	const response = await fetch(`https://${import.meta.env.VITE_BACKEND_URL}/${route}`, request)
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}
