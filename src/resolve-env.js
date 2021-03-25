const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const PREFIX_RE = /^process.env./

/**
 * 取得環境變數物件
 * 
 * @description 
 * 依照給定的路徑取得環境變數檔案，並且解析為物件回傳，若檔案不存在，則回傳空物件
 * 
 * @param  {...any} arg  與 `fs.readFileSync` 相同的參數捨應
 * @returns {Object}
 */
const getEnvs = function getEnvs (path, ...arg) {
  return fs.existsSync(path)
    ? dotenv.parse(fs.readFileSync(path, ...arg))
    : {}
}

/**
 * 將環境變數依照 webpack 需求格式化
 * 
 * @param {Object} variables  環境變數物件
 * @returns {Object}          經過整理的環境變數物件
 * 
 * @see https://webpack.js.org/plugins/define-plugin/#usage
 */
const handleValueFormate = function handleValueFormate (variables) {
  const formatted = Object.keys(variables).reduce(function reducekey (obj, key) {
    /**
     * 在所有 key 直前面直前面加上 `process.env` 才能將環境變數注入到 webpack 中。
     * @see https://github.com/rollup/rollup/issues/487#issuecomment-177596512
     */
    const envKey = !PREFIX_RE.test(key) ? `process.env.${key}` : key
    obj[envKey] = JSON.stringify(variables[key])

    return obj
  }, {})

  return formatted
} 

/**
 * 導入環境變數
 * 
 * @param {Object} [parsed]  從 webpack 自定義的環境變數
 * @returns {Object}         環境變數物件
 */
const resolveEnvVariable = function resolveEnvVariable (
  parsed = {}, 
  root = process.cwd()
) {
  const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'

  try {
    parsed = Object.assign(
      {},
      getEnvs(path.resolve(root, '.env'), 'utf8'),
      getEnvs(path.resolve(root, `.env.${env}`), 'utf8'),
      parsed
    )
  } catch (error) {
    console.error(error)
  }

  parsed = handleValueFormate(parsed)

  return parsed
}

module.exports = resolveEnvVariable