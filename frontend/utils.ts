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
	const response = await fetch(`http://localhost:3080/${route}`, request)
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}

export async function get(route: string, message: string): Promise<Response> {
	const response = await fetch(`http://localhost:3080/${route}`, {
		method: 'GET',
		credentials: 'include',
	})
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}

export async function del(route: string, message: string): Promise<Response> {
	const response = await fetch(`http://localhost:3080/${route}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!response.ok)
		throw new Error(`${message} (status ${response.status}): ${response.body}`)
	return response
}
