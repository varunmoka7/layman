# layman

A Claude Code plugin that adds plain-reply rules to the model's context when
a prompt of 200 characters or less asks for a plain explanation. It matches
words such as `layman`, `im lost`, `didnt understand`, and `explain again`.
From the second matching ask in a session, it keeps adding rules for plain
replies, and the status line shows `plain mode`.

## Install

In Claude Code, add this marketplace and install the plugin:

```text
/plugin marketplace add varunmoka7/layman
/plugin install layman@layman
```

Once layman is listed in the Anthropic plugin directory, you can also find
and install it there.

## In the Claude apps and Cowork

The hook only runs in Claude Code. The same plain-reply rules ship as a skill
(`skills/layman/SKILL.md`), so in the Claude apps and Cowork the model applies
them when you ask for a plain explanation. There the second-ask memory is the
model's, not a counter.

## Commands

- `/layman on` turns plain mode on and shows `plain mode` in the status line.
- `/layman off` turns it off, clears the status, and resets the ask count.
- `/layman` flips plain mode on or off.

After turning it off, matching prompts can start plain mode again.

## How it works

The plugin keeps an ask counter for each session, starting at zero. Each
matching prompt adds one. At two or more, plain mode stays on. The commands
set the counter to two for on or zero for off.

Matching ignores capital letters and checks prompts of at most 200 characters
for any of these patterns:

- `layman` or `lay man`.
- `im lost`, `I'm lost`, or `i am lost`, as whole words.
- `did not`, `didnt`, `didn't`, `didt`, `didit`, `do not`, `dont`, or `don't`,
  followed by whitespace and a word starting with `unders`. This includes
  `understand`, `understadn`, and `undersatnd`.
- `explain again`, optionally with `it`, `that`, or `this` before `again`.

It adds one of two notes to the prompt's existing context:

- For a matching ask, use everyday words and one idea. If no topic is named,
  explain the previous reply again. Define working terms in the same sentence
  or leave them out. Use one real example and one everyday comparison. Number
  steps when needed, avoid findings tables and new topics, and end with at most
  one yes-or-no question with a suggested answer.
- For other prompts while plain mode is on, use everyday words from the first
  line and define working terms in the same sentence.

Otherwise, the plugin passes the prompt through without adding a note.

## Privacy

The plugin runs entirely on your machine. It reads only the prompt text you
type to check for a match and stores one number per session: the ask count.
It sends nothing anywhere and makes no network calls. The notes become part
of the context Claude Code gives the model.

## Security

Report security issues through
[GitHub private vulnerability reporting](https://github.com/varunmoka7/layman/security/advisories/new).

## Development

Run the tests and validate the plugin from this folder:

```sh
claude plugin test .
claude plugin validate .
```

## Status

Tested on macOS with Claude Code 2.1.288, as reported by `claude --version`.
All three tests passed. Plugin validation passed.
The tests cover matching prompts, plain mode after the second ask, command
switches, and prompts that should not match.

## License

MIT. See [LICENSE](LICENSE).
