export async function GET() {
	const res = await fetch(`${process.env.API_URL}/v3/api-docs`)
	const json = await res.json()
	return Response.json(json)
}
