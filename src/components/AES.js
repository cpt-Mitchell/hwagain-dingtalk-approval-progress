import CryptoJS from 'crypto-js'

// 默认的 KEY 与 iv 如果没有给
const key = CryptoJS.enc.Utf8.parse('12hwagain-mail56')
// const iv = CryptoJS.enc.Utf8.parse('12hwagain-mail56')
/**
  * AES加密 ：字符串 key iv  返回base64
  */
export function Encrypt(word) {
  var encrypted = ''
  if (typeof(word) === 'string') {

  } else if (typeof(word) === 'object') {
      word = JSON.stringify(word)
  }
  var srcs = CryptoJS.enc.Utf8.parse(word)
  encrypted = CryptoJS.AES.encrypt(srcs, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  // console.log("-=-=-=-", encrypted.ciphertext)
//   return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
return encrypted.toString()
}
/**
  * AES 解密 ：字符串 key iv  返回base64
  *
  */
export function Decrypt(word) {
//   if (keyStr) {
//     key = CryptoJS.enc.Utf8.parse(keyStr)
//     iv = CryptoJS.enc.Utf8.parse(ivStr)
//   }

  let base64 = CryptoJS.enc.Base64.parse(word)
  let src = CryptoJS.enc.Base64.stringify(base64)

  var decrypt = CryptoJS.AES.decrypt(src, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}