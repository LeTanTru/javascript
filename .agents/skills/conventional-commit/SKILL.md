---
name: conventional-commit
description: 'Prompt and workflow for generating conventional commit messages using a structured XML format. Guides users to create standardized, descriptive commit messages in line with the Conventional Commits specification, including instructions, examples, and validation.'
---

### Instructions

```xml
<description>
This file contains a prompt template for generating conventional commit messages. It provides instructions, examples, and formatting guidelines to help users write standardized, descriptive commit messages in accordance with the Conventional Commits specification.
</description>
```

### Safety Rules

- Only perform Git operations that the user explicitly requests.
- You may use read-only Git commands such as `git status`, `git diff`, `git diff --cached`, and `git log` to inspect the repository.
- **Do NOT** run `git add`, `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, `git reset`, `git restore`, `git checkout`, `git switch`, `git stash`, `git cherry-pick`, `git revert`, or any other command that modifies the repository state unless the user explicitly requests it.
- Never stage files automatically. If changes are not staged, inform the user and wait for explicit permission before running `git add`.
- Never push commits to a remote repository unless the user explicitly requests `git push`.
- If the user only asks for a commit message, generate the commit message only and do not execute any Git commands.
- If the user asks you to commit, only commit the files that are already staged unless they explicitly ask you to stage files first.

### Workflow

**Follow these steps:**

1. Run `git status` to review changed files.
2. Run `git diff` or `git diff --cached` to inspect the changes.
3. Determine whether there are staged changes.
   - If there are staged changes, generate the appropriate Conventional Commit message.
   - If there are no staged changes, inform the user that nothing is staged and wait for explicit instructions before running `git add`.
4. Construct the commit message using the XML structure below.
5. If the user explicitly requested a commit and there are staged changes, execute:

```bash
git commit -m "type(scope): description"
```

6. Do **not** execute `git push` unless the user explicitly requests it.

### Commit Message Structure

```xml
<commit-message>
    <type>feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert</type>
    <scope>()</scope>
    <description>A short, imperative summary of the change</description>
    <body>(optional: more detailed explanation)</body>
    <footer>(optional: e.g. BREAKING CHANGE: details, or issue references)</footer>
</commit-message>
```

### Examples

```xml
<examples>
    <example>feat(parser): add ability to parse arrays</example>
    <example>fix(ui): correct button alignment</example>
    <example>docs: update README with usage instructions</example>
    <example>refactor: improve performance of data processing</example>
    <example>chore: update dependencies</example>
    <example>feat!: send email on registration (BREAKING CHANGE: email service required)</example>
</examples>
```

### Validation

```xml
<validation>
    <type>
        Must be one of the allowed types.
        See <reference>https://www.conventionalcommits.org/en/v1.0.0/#specification</reference>
    </type>
    <scope>Optional, but recommended for clarity.</scope>
    <description>
        Required. Use the imperative mood (e.g., "add", not "added").
    </description>
    <body>Optional. Use for additional context.</body>
    <footer>Use for breaking changes or issue references.</footer>
</validation>
```

### Final Step

```xml
<final-step>
    <cmd>git commit -m "type(scope): description"</cmd>
    <note>
        Execute this command only if:
        1. The user explicitly requested a commit.
        2. There are staged changes.
        Do not stage files or push commits unless the user explicitly requests those actions.
    </note>
</final-step>
```
