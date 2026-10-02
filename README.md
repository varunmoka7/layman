<p align="center">
  <img src=".claude-plugin/icon.png" width="96" alt="layman">
</p>

<h1 align="center">layman</h1>

<p align="center">
  Say <em>I'm lost</em> and Claude explains it again, plainly.
</p>

<p align="center">
  <a href="https://github.com/varunmoka7/layman/releases"><img src="https://img.shields.io/github/v/release/varunmoka7/layman?style=flat-square&color=111111&label=release" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license"></a>
  <a href="https://github.com/varunmoka7/layman/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/varunmoka7/layman/test.yml?style=flat-square&color=111111&label=tests" alt="Tests"></a>
</p>

---

## The idea

Claude Code is a program you talk to in your terminal, and it writes and
fixes code for you. Its replies are written for programmers. When you are
not one, or you are tired, a reply can be four paragraphs of words you do
not know, and the easiest thing is to nod and move on.

layman gives you a way out. You type one of a few short phrases, such as
`layman`, `I'm lost` or `explain again`, and the next reply comes back in
everyday words: one idea, one real example taken from your own work, one
comparison to something ordinary, and at most one yes-or-no question. If you
ask twice in the same session, layman assumes you want every reply that way
and keeps them plain until you say otherwise.

Think of it as the friend who sits next to you and says "in other words..."
after the expert has finished talking.

## Who it is for

Anyone who uses Claude Code without reading error messages for a living:
product and data people, students, writers, researchers, and anyone whose
first language is not English. If you have ever read a reply twice and then
quietly asked a colleague, this is the button for that moment.

## Before and after

You asked why your build fails and got a paragraph about peer dependency
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

A plugin is a small add-on that Claude Code loads when it starts. A
marketplace is a list of plugins Claude Code can install from. This
repository is both: it holds the plugin and the one-line marketplace list
that points at it. Inside Claude Code, type:

```text
/plugin marketplace add varunmoka7/layman
/plugin install layman@layman
```

The first line tells Claude Code where to look. The second installs layman
from there. It needs Claude Code 2.1 or later. Once layman is listed in the
Anthropic plugin directory, the built-in catalogue of plugins, you can
install it from there instead.

**Try it without installing.** The rules layman uses are six plain sentences
in [`skills/layman/SKILL.md`](skills/layman/SKILL.md). Paste them into any
Claude chat and ask for a plain explanation. That is exactly the text the
plugin attaches.

## Using it

Most of the time you do nothing special. You type one of the phrases below as
your prompt and the next reply is plain.

### The phrases

layman looks at each prompt you type. If the prompt is 200 characters or
less and contains one of these, it counts as an ask. Capital letters do not
matter.

- `layman` or `lay man`
- `im lost`, `I'm lost`, `i am lost`
- `didn't understand`, `didnt understand`, `dont understand`,
  `do not understand`, plus the typos people actually make
  (`didt`, `didit`, `understadn`, `undersatnd`)
- `explain again`, `explain it again`, `explain that again`,
  `explain this again`

Why 200 characters? A long prompt that happens to contain "I'm lost" is
usually about something else, for example a bug report that quotes a user.
Short prompts with these words are almost always a person asking for help.

### Plain mode

Plain mode is the state where every reply stays plain, not just the next one.
It switches itself on at your second ask in a session. A session is one run
of Claude Code, from when you open it to when you close it. While plain mode
is on, the status line, the small line of text at the bottom of the Claude
Code window, shows `plain mode`.

You can also switch it by hand:

| Command | What happens |
|---------|--------------|
| `/layman on` | Plain mode on. The status line shows `plain mode`. |
| `/layman off` | Plain mode off. The status line clears and the ask count goes back to zero. |
| `/layman` | Flips it: on if it was off, off if it was on. |

A command is anything you type that starts with a slash. Claude Code runs it
directly instead of sending it to the model.

After `/layman off`, asking twice more turns plain mode on again.

## How it works

Claude Code lets a plugin register a hook, which is a small piece of code
that runs at a fixed moment, in this case every time you submit a prompt.
layman's hook does three things, in this order:

1. **Count.** It keeps one number per session, the ask count, starting at
   zero. If your prompt matches one of the phrases above, the count goes up
   by one.
2. **Decide.** If the count is two or more, plain mode is on and the status
   line shows `plain mode`.
3. **Attach a note.** Along with your prompt, Claude Code passes the model
   some context, meaning extra text the model reads but you do not see.
   layman adds one short note to that context:
   - For a matching ask: use everyday words from the first line; one idea;
     if the prompt names no topic, explain the previous reply again; say what
     any technical term means in the same sentence or leave it out; give one
     real example from the work in hand and one everyday comparison; number
     the steps if there is a sequence; no findings tables and no new topics;
     end with at most one yes-or-no question and say which answer you would
     pick.
   - For any other prompt while plain mode is on: use everyday words from the
     first line and explain terms as you go.

If the prompt does not match and plain mode is off, the hook adds nothing and
your prompt goes through untouched.

`/layman on` sets the count to two. `/layman off` sets it to zero. That is the
whole mechanism.

## In the Claude apps and Cowork

Hooks only exist in Claude Code. The Claude apps (the website and the desktop
and phone apps) and Cowork, Claude's workspace for teams, cannot run them.
So layman also ships the same six rules as a skill, a text file the model
reads when it decides the file is relevant. In those apps the model applies
the rules when you ask for a plain explanation. There is no counter there,
so whether it remembers your second ask is up to the model.

## Privacy

Everything runs on your computer. The plugin reads the text of your prompt to
check for a phrase and stores one number, the ask count, for the length of
the session. It makes no network calls and sends nothing anywhere. The note
it adds becomes part of the context Claude Code was already going to give
the model.

## Development

```sh
claude plugin test .
claude plugin validate .
```

The first command runs the tests in `tests/`, which check that the phrases
match, that near misses do not, that plain mode turns on at the second ask,
and that the commands switch it. The second checks that the plugin files are
well formed. Both also run on GitHub for every change. Tested on macOS with
Claude Code 2.1.288.

What is in the folder:

```text
.claude-plugin/   plugin.json (name, version, keywords), marketplace.json, icon
hooks/            register.ts, the hook and the /layman command
skills/layman/    SKILL.md, the same rules for the Claude apps and Cowork
tests/            the test suite
```

## Contributing

Issues and pull requests are welcome. If you add a phrase, add it to the hits
list in `tests/layman.test.ts` and to the list above. Keep the plugin small:
one hook, one command, no network.

## Security

Report security issues through
[GitHub private vulnerability reporting](https://github.com/varunmoka7/layman/security/advisories/new).

## License

[MIT](LICENSE)
