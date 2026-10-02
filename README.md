<p align="center">
  <img src=".claude-plugin/icon.png" width="96" alt="layman">
</p>

<h1 align="center">layman</h1>

<p align="center">
  Plain-language replies in Claude Code, when you ask for them.
</p>

<p align="center">
  <a href="https://github.com/varunmoka7/layman/releases"><img src="https://img.shields.io/github/v/release/varunmoka7/layman?style=flat-square&color=111111&label=release" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license"></a>
  <a href="https://github.com/varunmoka7/layman/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/varunmoka7/layman/test.yml?style=flat-square&color=111111&label=tests" alt="Tests"></a>
</p>

---

Type `layman`, `I'm lost` or `explain again` and the next reply comes back in
everyday words: one idea, one real example from your work, one everyday
comparison, and at most one yes-or-no question. Ask twice in a session and
plain mode stays on until you turn it off.

It runs as a `prompt.submit` hook. Nothing leaves your machine.

## Before and after

You asked why a build fails and got a paragraph about peer dependency
resolution. You type:

```text
layman
```

The reply now reads like this:

> Your project asked for two different versions of the same library and npm
> refused to pick one. It is like two people booking the same seat. Run
> `npm install react@18` so both sides agree on one version. Want me to run
> it? I would.

## Install

```text
/plugin marketplace add varunmoka7/layman
/plugin install layman@layman
```

Requires Claude Code 2.1 or later. Once layman is listed in the Anthropic
plugin directory you can also install it from there.

## Usage

Just type one of the trigger phrases as your prompt. For a manual switch:

| Command | Effect |
|---------|--------|
| `/layman on` | Plain mode on. The status line shows `plain mode`. |
| `/layman off` | Plain mode off. Clears the status and resets the ask count. |
| `/layman` | Flips plain mode. |

After `/layman off`, a matching prompt can start plain mode again.

### Trigger phrases

Matching ignores case and only looks at prompts of 200 characters or less,
because longer prompts that mention these words are usually about something
else.

- `layman` or `lay man`
- `im lost`, `I'm lost`, `i am lost`
- `didn't understand`, `didnt understand`, `dont understand`, `do not
  understand`, and the typos seen in real transcripts (`didt`, `didit`,
  `understadn`, `undersatnd`)
- `explain again`, `explain it again`, `explain that again`, `explain this
  again`

## How it works

The plugin keeps one counter per session: how many times you asked for a plain
explanation. Each matching prompt adds one.

1. **First ask.** The prompt gets a note with the plain-reply rules: everyday
   words from the first line, one idea, define any working term in the same
   sentence or drop it, one real example and one everyday comparison, numbered
   steps if there is a sequence, no findings tables, no new topics, and at most
   one yes-or-no question with a suggested answer. If the prompt names no
   topic, the model re-explains its previous reply.
2. **Second ask and after.** Plain mode is on. Every later prompt gets a shorter
   note: everyday words from the first line, define working terms as you go.
   The status line shows `plain mode`.
3. **`/layman on` and `/layman off`** set the counter to two or zero.

Prompts that do not match pass through untouched.

## In the Claude apps and Cowork

The hook only runs in Claude Code. The same rules ship as a skill in
`skills/layman/SKILL.md`, so in the Claude apps and Cowork the model applies
them when you ask for a plain explanation. There the second-ask memory is the
model's own, not a counter.

## Privacy

Everything runs locally. The plugin reads the prompt text you type to check
for a match and stores one number per session, the ask count. It makes no
network calls and sends nothing anywhere. The notes it adds become part of the
context Claude Code already gives the model.

## Development

```sh
claude plugin test .
claude plugin validate .
```

The tests cover the trigger phrases and near misses, plain mode after the
second ask, and the command switches. Tested on macOS with Claude Code 2.1.288.

Layout:

```text
.claude-plugin/   plugin.json, marketplace.json, icon
hooks/            register.ts (the hook and the /layman command)
skills/layman/    SKILL.md for the Claude apps and Cowork
tests/            claude plugin test suite
```

## Contributing

Issues and pull requests are welcome. If you add a trigger phrase, add it to
the hits list in `tests/layman.test.ts` and to the list above. Keep the plugin
small: one hook, one command, no network.

## Security

Report security issues through
[GitHub private vulnerability reporting](https://github.com/varunmoka7/layman/security/advisories/new).

## License

[MIT](LICENSE)
