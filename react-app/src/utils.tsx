// https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript
// Standard variation
export async function api<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>
    })
}