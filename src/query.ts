/**
 * Handles URL query to word string.
 */

import bs58 from 'bs58'
import router from './router/router'

// go to main page, silently
function goHome() {
  router.push("/")
  return
}

export function getAnswer() {

  // if no url query, push back to main page silently
  if (!location.search) {
    goHome()
  }

  // proper url query form:
  // .../game?[FOUR_CHARS]=[BASE58_STRING]
  try {
    const b58_str = location.search.match("([^&]{4})=([^&]*)")[2]  // regex parse b58 encoded string from url query
    if (b58_str == "" || b58_str == null) { goHome() }  // check if string exists, or if is null
    const uint8array = bs58.decode(b58_str)  // decode step 1: b58 to bytes
    const word = new TextDecoder().decode(uint8array);  // decode step 2: bytes to string
    return word
  } catch (e) {
    // alert(e)
    goHome()
  }

}
