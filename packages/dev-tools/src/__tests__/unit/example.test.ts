import { nameTime } from '../../example'

describe('example time module', () => {
  test('when time is 6 result should be Day', () => {
    expect(nameTime(6)).toBe('Day')
  })

  test('when time is 10 result should be Day', () => {
    expect(nameTime(10)).toBe('Day')
  })

  test('when time is 18 result should be Day', () => {
    expect(nameTime(18)).toBe('Day')
  })

  test('when time is 5 result should be Night', () => {
    expect(nameTime(5)).toBe('Night')
  })

  test('when time is 19 result should be Night', () => {
    expect(nameTime(19)).toBe('Night')
  })
})
