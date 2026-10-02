import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'

// A prompt as the person types it at the terminal.
const typed = (text: string) => ({ text, wait: false, origin: { kind: 'composer' } }) as const

// Stands for the engine: what reached the model beside the prompt, and the status line.
const host = (on: On) => {
  const seen = { notes: [] as (readonly string[] | undefined)[], status: [] as (string | undefined)[] }
  on('prompt.submit', (_, e) => {
    seen.notes.push(e.context)
    return { text: e.text, context: e.context }
  })
  on('ui.status', (_, e) => {
    seen.status.push(e.text)
    return { value: undefined }
  })

  return seen
}

test('a layman ask gets the rules, and the second ask keeps later replies plain', async ($, on) => {
  const seen = host(on)

  await $.prompt.submit(typed('fix the build'))
  expect(seen.notes.at(-1)).toBeUndefined()

  await $.prompt.submit(typed('layman it please'))
  expect(seen.notes.at(-1)?.[0]).toContain('everyday words')
  expect(seen.status).toEqual([])

  await $.prompt.submit(typed('fix the build'))
  expect(seen.notes.at(-1)).toBeUndefined()

  await $.prompt.submit(typed('i didt understadn'))
  expect(seen.notes.at(-1)?.[0]).toContain('re-explain your previous reply')
  expect(seen.status.at(-1)).toBe('plain mode')

  await $.prompt.submit(typed('fix the build'))
  expect(seen.notes.at(-1)?.[0]).toContain('more than once this session')
})

test('/layman switches plain mode on and off', async ($, on) => {
  const seen = host(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  const run = (args: string) =>
    $.command.run({
      command: 'layman',
      args,
      origin: { kind: 'composer' },
      presentation: { isFullscreen: false, columns: 120 },
    })

  expect((await run('on')).text).toBe('Plain mode on.')
  expect(seen.status.at(-1)).toBe('plain mode')
  await $.prompt.submit(typed('fix the build'))
  expect(seen.notes.at(-1)?.[0]).toContain('more than once this session')

  expect((await run('off')).text).toBe('Plain mode off.')
  expect(seen.status.at(-1)).toBeUndefined()
  await $.prompt.submit(typed('fix the build'))
  expect(seen.notes.at(-1)).toBeUndefined()

  expect((await run('')).text).toBe('Plain mode on.')
  expect((await run('')).text).toBe('Plain mode off.')
})

test('the typed spellings trigger, and near misses do not', async ($, on) => {
  const seen = host(on)
  const hits = ['layman', 'im lost', "I'm lost", 'i didnt understand', 'i didit understand', 'i dont understadn this worktree task', 'explain again']
  const misses = ['ok i did understand that', 'status?', `layman ${'x'.repeat(250)}`]

  for (const text of misses) {
    await $.prompt.submit(typed(text))
    expect(seen.notes.at(-1)).toBeUndefined()
  }

  for (const text of hits) {
    await $.prompt.submit(typed(text))
    expect(seen.notes.at(-1)?.[0]).toContain('The user asked for a plain explanation')
  }
})
