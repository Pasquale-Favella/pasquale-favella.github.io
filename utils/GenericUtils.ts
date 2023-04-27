
const uid = ()=> crypto.getRandomValues(new Uint32Array(1)).toString()

export default {
    uid
} as const