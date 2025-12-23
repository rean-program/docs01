# Version Control with Git

Version control is essential for tracking changes in your code, collaborating with others, and maintaining project history. Git is the most widely used version control system.

## What is Git?

Git is a distributed version control system that:
- Tracks changes to your files over time
- Allows multiple developers to collaborate
- Enables branching for parallel development
- Provides history of all changes

## Installing Git

### Windows
Download from [git-scm.com](https://git-scm.com/download/windows)

### Mac
```bash
# Using Homebrew
brew install git

# Or download from git-scm.com
```

### Linux
```bash
# Ubuntu/Debian
sudo apt install git

# Fedora
sudo dnf install git
```

### Verify Installation
```bash
git --version
# Output: git version 2.x.x
```

## Initial Configuration

Set up your identity (required before first commit):

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# View your configuration
git config --list
```

## Basic Git Workflow

### 1. Initialize a Repository

```bash
# Create new project folder
mkdir my-project
cd my-project

# Initialize Git
git init
```

### 2. Check Status

```bash
git status
```

Output shows:
- Current branch
- Staged changes
- Unstaged changes
- Untracked files

### 3. Stage Changes

```bash
# Stage specific file
git add filename.html

# Stage multiple files
git add file1.js file2.css

# Stage all changes
git add .

# Stage all changes (alternative)
git add -A
```

### 4. Commit Changes

```bash
# Commit with message
git commit -m "Add homepage layout"

# Commit with detailed message
git commit -m "Add homepage layout

- Created header with navigation
- Added hero section
- Implemented footer"
```

### 5. View History

```bash
# View commit history
git log

# Compact view
git log --oneline

# With graph
git log --oneline --graph
```

## The Three States

Git has three main states for your files:

```
Working Directory → Staging Area → Repository
     (edit)           (add)        (commit)
```

| State | Description |
|-------|-------------|
| Modified | Changed but not staged |
| Staged | Marked for next commit |
| Committed | Safely stored in repository |

## Essential Commands

### Viewing Changes

```bash
# See unstaged changes
git diff

# See staged changes
git diff --staged

# See changes in specific file
git diff filename.js
```

### Undoing Changes

```bash
# Discard changes in working directory
git checkout -- filename.js

# Unstage a file (keep changes)
git reset HEAD filename.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) ⚠️
git reset --hard HEAD~1
```

### Removing Files

```bash
# Remove file from Git and filesystem
git rm filename.js

# Remove from Git only (keep file)
git rm --cached filename.js
```

## Branching

Branches allow parallel development without affecting the main code.

### Branch Commands

```bash
# List branches
git branch

# Create new branch
git branch feature-login

# Switch to branch
git checkout feature-login

# Create and switch (shortcut)
git checkout -b feature-login

# Modern alternative
git switch feature-login
git switch -c feature-login  # create and switch
```

### Merging Branches

```bash
# Switch to main branch
git checkout main

# Merge feature branch
git merge feature-login

# Delete merged branch
git branch -d feature-login
```

### Merge Conflicts

When Git can't automatically merge:

```
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> feature-branch
```

**Resolution Steps:**
1. Open conflicted file
2. Choose which changes to keep
3. Remove conflict markers
4. Stage and commit

## Working with Remotes

### GitHub/GitLab Setup

```bash
# Add remote repository
git remote add origin https://github.com/username/repo.git

# View remotes
git remote -v

# Push to remote
git push -u origin main

# Pull from remote
git pull origin main
```

### Clone Repository

```bash
# Clone existing repository
git clone https://github.com/username/repo.git

# Clone to specific folder
git clone https://github.com/username/repo.git my-folder
```

### Push and Pull

```bash
# Push changes
git push

# Pull changes
git pull

# Fetch without merging
git fetch
```

## .gitignore File

Tell Git which files to ignore:

```gitignore
# Dependencies
node_modules/
vendor/

# Build output
dist/
build/

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

## Common Workflows

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feature-navbar

# 2. Make changes and commit
git add .
git commit -m "Add responsive navbar"

# 3. Push feature branch
git push -u origin feature-navbar

# 4. Create Pull Request on GitHub

# 5. After review, merge to main
git checkout main
git pull
git merge feature-navbar

# 6. Delete feature branch
git branch -d feature-navbar
git push origin --delete feature-navbar
```

### Daily Workflow

```bash
# Start of day: get latest changes
git pull

# Work on your changes
# ... edit files ...

# Check what changed
git status
git diff

# Stage and commit
git add .
git commit -m "Implement user profile page"

# Push your changes
git push
```

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `git init` | Initialize repository |
| `git clone <url>` | Clone repository |
| `git status` | Check status |
| `git add <file>` | Stage changes |
| `git commit -m "msg"` | Commit changes |
| `git push` | Push to remote |
| `git pull` | Pull from remote |
| `git branch` | List branches |
| `git checkout <branch>` | Switch branch |
| `git merge <branch>` | Merge branch |
| `git log` | View history |
| `git diff` | View changes |
| `git stash` | Temporarily save changes |
| `git stash pop` | Restore stashed changes |

## Best Practices

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issues: "Fix login bug (#123)"

### Branching
- Keep `main` branch stable
- Use descriptive branch names: `feature/user-auth`, `fix/navbar-bug`
- Delete merged branches

### General
- Commit often, push regularly
- Pull before starting new work
- Review changes before committing
- Use `.gitignore` from the start

## Summary

- Git tracks changes to your code over time
- Basic workflow: edit → add → commit → push
- Branches enable parallel development
- Remotes like GitHub enable collaboration
- Good commit messages make history useful

## Next Steps

Learn about [Web Accessibility](/guide/best-practices/web-accessibility) to make your websites usable by everyone.
