// https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript
// Standard variation
export async function api<T>(url: string): Promise<T> {
  // await new Promise(r => setTimeout(r, 2000))
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>
    })
}