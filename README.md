# what-changed

A Claude Code mod that shows a band above the prompt counting the files Claude changed this turn (via `Edit` and `Write`), and how many of them are in a `final/` folder. A toast appears each time a file in `final/` changes. The band has a **Hide** button.

## Install

In a terminal Claude Code session, run:

```
/plugin install what-changed --marketplace ice-lfernandes/what-changed
```

Then answer `y` to add the marketplace and pick a scope (user scope is the first option). The mod is active right away, with no reload.

## Develop

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```
