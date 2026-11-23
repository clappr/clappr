const REGISTRY = 'https://registry.npmjs.org'

// 404 is the registry saying "no such version". Any other answer, or none, is not "absent": reading
// it that way would make a recovery run republish or a normal run bump over a published version.
export async function isPublished({ name, version, fetchImpl = fetch }) {
  const response = await fetchImpl(`${REGISTRY}/${name.replace('/', '%2F')}/${version}`)

  if (response.ok) return true
  if (response.status === 404) return false
  throw new Error(`npm registry could not answer for ${name}@${version}: ${response.status}`)
}
