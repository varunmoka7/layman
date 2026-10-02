import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const asks = atom({ plugin: 'layman', key: 'asks' } as const, 0)

// Longer prompts that mention these words are usually about something else.
const MAX_CHARS = 200

// Covers the spellings seen in the transcripts: "didt", "didit", "understadn", "undersatnd".
const TRIGGER =
  /lay\s?man|\b(i'?m|i am) lost\b|\b(did not|didn'?t|didt|didit|do not|don'?t)\s+unders\w*|explain (it |that |this )?again/i

const EXPLAIN = [
  'The user asked for a plain explanation.',
  'If their message names no topic, re-explain your previous reply only; otherwise answer what it asks.',
  'Rules for this reply: everyday words from the first line. One idea.',
  'Say what any working term means in the same sentence, or leave the term out.',
  'Use one real example from the work in hand (a real row, file or number) and one everyday comparison.',
  'Number the steps if there is a sequence. No findings tables and no new topics.',
  'End with at most one yes-or-no question, with your pick stated.',
].join(' ')

const STICKY =
  'The user has asked for plain explanations more than once this session. Write this reply in everyday words from the first line, and say what any working term means in the same sentence.'

// Plain mode is on from the second ask; /layman sets the count to this or to 0.
const ON = 2

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'layman',
      description: 'Switch plain mode on or off: /layman on, /layman off, or /layman to flip it',
      immediate: true,
    })

    return next(e)
  })

  on('command.run', { command: 'layman' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    const isOn = arg === 'on' || (arg !== 'off' && (await read($, asks)) < ON)
    await update($, asks, () => (isOn ? ON : 0))
    $.ui.status(isOn ? 'plain mode' : undefined)

    return { text: isOn ? 'Plain mode on.' : 'Plain mode off.' }
  })

  on('prompt.submit', async ($, e, next) => {
    const isAsk = e.text.length <= MAX_CHARS && TRIGGER.test(e.text)

    if (isAsk) {
      await update($, asks, n => n + 1)
    }

    const isPlain = (await read($, asks)) >= ON

    if (isPlain) {
      $.ui.status('plain mode')
    }

    const note = isAsk ? EXPLAIN : isPlain ? STICKY : null

    return note === null ? next(e) : next({ ...e, context: [...(e.context ?? []), note] })
  })
}
