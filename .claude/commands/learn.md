Reflect on the current conversation and extract anything worth preserving for future sessions.

Go through the full conversation transcript and look for:

1. **User preferences** — how they like to communicate, what they find annoying, what they appreciate
2. **Workflow patterns** — repeated actions, common setups, things they do often
3. **Project-specific context** — decisions made, constraints discovered, architecture choices
4. **Reusable procedures** — multi-step processes that could become a skill

Then categorize each finding:

- **CLAUDE.md** — persistent project context, conventions, goals, constraints. Things Claude should always know about this project.
- **New skill** — a repeatable procedure worth turning into a `/command`. Only suggest this if the procedure has 3+ steps and would genuinely be reused.
- **Memory** — user preferences or feedback that should be saved to the auto-memory system.
- **Not worth saving** — ephemeral, one-off, or already obvious from the code.

Present your findings in this format:

---
## What I found

### → CLAUDE.md additions
<bullet list of proposed additions>

### → Suggested new skills
<name and one-line description for each, or "none">

### → Memory updates
<what to save and why, or "none">

### → Skipped (why)
<anything you considered but decided wasn't worth saving>

---

After presenting the findings, ask the user: "Should I apply any of these?" and wait for confirmation before making any changes.

When applying:
- CLAUDE.md: read the existing file first, then append or merge — never overwrite sections that already exist
- New skill: write to `.claude/commands/<skill-name>.md`
- Memory: use the Write tool to save to the memory directory
