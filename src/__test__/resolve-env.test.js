const path = require('path')
const resolveEnvVariable = require('../resolve-env')

test('get env object pass value type is string', () => {
  const env = { type: 'test' }

  expect(resolveEnvVariable(env)).toEqual({ 
    'process.env.type': '"test"' 
  })
})

test('get env object pass value type is number', () => {
  const env = { type: 10 }

  expect(resolveEnvVariable(env)).toEqual({ 
    'process.env.type': '10' 
  })
})

test('get env object pass value type is boolean', () => {
  const env = { type: true }

  expect(resolveEnvVariable(env)).toEqual({ 
    'process.env.type': 'true' 
  })
})

test('get env object when pass key have prefix \'process.env.\'', () => {
  const env = {
    'process.env.type': 'test' 
  }

  expect(resolveEnvVariable(env)).toEqual({ 
    'process.env.type': '"test"' 
  })
})

test('get env object when have .env file', () => {
  expect(resolveEnvVariable({}, __dirname)).toEqual({ 
    'process.env.FILE_NAME': '"env"' 
  })
})

test('get empty env object when pass undefined', () => {
  expect(resolveEnvVariable()).toEqual({})
})