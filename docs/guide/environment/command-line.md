# Command Line Basics

The command line (also called terminal or shell) is a text-based interface for interacting with your computer. It's an essential tool for web developers.

## Why Learn the Command Line?

- Run development tools (npm, git, etc.)
- Navigate files faster than GUI
- Automate repetitive tasks
- Access remote servers
- Required for many development workflows

## Opening the Terminal

### Windows
- **Command Prompt**: Search "cmd" in Start menu
- **PowerShell**: Search "PowerShell" in Start menu
- **Git Bash**: Installed with Git (recommended)
- **Windows Terminal**: Modern terminal app from Microsoft Store

### Mac
- Press `Cmd + Space`, type "Terminal"
- Or: Applications → Utilities → Terminal
- **iTerm2**: Popular alternative terminal

### Linux
- Press `Ctrl + Alt + T`
- Or find Terminal in applications menu

## Understanding the Prompt

```bash
# Mac/Linux format
username@hostname:~/projects$

# Windows (PowerShell)
PS C:\Users\username\projects>

# Windows (Command Prompt)
C:\Users\username\projects>
```

| Part | Meaning |
|------|---------|
| `username` | Your user account |
| `hostname` | Computer name |
| `~` | Home directory |
| `$` or `>` | Ready for input |

## Basic Navigation

### Print Working Directory

```bash
# Show current location
pwd

# Output example:
/Users/username/projects
```

### List Files and Directories

```bash
# List files
ls

# List with details (permissions, size, date)
ls -l

# List including hidden files
ls -a

# List with details + hidden files
ls -la

# Windows Command Prompt alternative
dir
```

### Change Directory

```bash
# Go to a directory
cd projects

# Go to home directory
cd ~
cd      # Also works on most systems

# Go up one level
cd ..

# Go up two levels
cd ../..

# Go to previous directory
cd -

# Go to absolute path
cd /Users/username/projects

# Windows paths use backslashes
cd C:\Users\username\projects
```

### Path Types

```bash
# Absolute path (starts from root)
/Users/username/projects/website

# Relative path (from current location)
projects/website
./projects/website

# Parent directory
../other-project

# Home directory shortcut
~/Documents
```

## Working with Files

### Create Files

```bash
# Create empty file
touch index.html

# Create multiple files
touch style.css script.js

# Create file with content (Mac/Linux)
echo "Hello World" > hello.txt

# Windows
echo Hello World > hello.txt
```

### Create Directories

```bash
# Create directory
mkdir my-project

# Create nested directories
mkdir -p projects/website/css

# Windows (no -p flag needed)
mkdir projects\website\css
```

### Copy Files

```bash
# Copy file
cp source.txt destination.txt

# Copy file to directory
cp file.txt my-folder/

# Copy directory (recursive)
cp -r source-folder destination-folder

# Windows
copy source.txt destination.txt
xcopy source-folder destination-folder /E
```

### Move/Rename Files

```bash
# Move file
mv file.txt new-location/

# Rename file
mv oldname.txt newname.txt

# Move and rename
mv old-folder/file.txt new-folder/renamed.txt

# Windows
move file.txt new-location\
rename oldname.txt newname.txt
```

### Delete Files

```bash
# Delete file
rm file.txt

# Delete multiple files
rm file1.txt file2.txt

# Delete directory (empty)
rmdir empty-folder

# Delete directory with contents (careful!)
rm -r folder-name

# Force delete without confirmation
rm -rf folder-name  # ⚠️ Use with caution!

# Windows
del file.txt
rmdir /s folder-name
```

::: warning
`rm -rf` is powerful and permanent. Double-check paths before running!
:::

## Viewing File Contents

```bash
# Display entire file
cat filename.txt

# Display with line numbers
cat -n filename.txt

# Display first 10 lines
head filename.txt

# Display first 20 lines
head -n 20 filename.txt

# Display last 10 lines
tail filename.txt

# Display last 20 lines
tail -n 20 filename.txt

# Watch file for changes (live logs)
tail -f logfile.txt

# Page through file
less filename.txt
# (press 'q' to quit)

# Windows
type filename.txt
more filename.txt
```

## Searching

### Find Files

```bash
# Find by name
find . -name "*.js"

# Find in specific directory
find /path/to/search -name "config.json"

# Find directories only
find . -type d -name "node_modules"

# Find files only
find . -type f -name "*.css"
```

### Search File Contents

```bash
# Search for text in file
grep "search term" filename.txt

# Search recursively in directory
grep -r "TODO" ./src

# Case-insensitive search
grep -i "error" logfile.txt

# Show line numbers
grep -n "function" script.js

# Show context (2 lines before and after)
grep -C 2 "bug" code.js
```

## Useful Commands

### Clear Screen

```bash
clear       # Mac/Linux
cls         # Windows
# Or press Ctrl + L
```

### Command History

```bash
# Show command history
history

# Run previous command
!!

# Run command by number
!123

# Search history (press Ctrl + R, then type)
(reverse-i-search)`git`: git push
```

### Getting Help

```bash
# Manual pages (Mac/Linux)
man ls
man git

# Help flag
ls --help
git --help

# Windows
help dir
command /?
```

### System Information

```bash
# Current user
whoami

# Current date/time
date

# Disk usage
df -h

# Directory size
du -sh folder-name

# Running processes
ps aux        # Mac/Linux
tasklist      # Windows
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Autocomplete file/folder names |
| `↑` / `↓` | Navigate command history |
| `Ctrl + C` | Cancel current command |
| `Ctrl + L` | Clear screen |
| `Ctrl + A` | Move cursor to start |
| `Ctrl + E` | Move cursor to end |
| `Ctrl + U` | Clear line before cursor |
| `Ctrl + K` | Clear line after cursor |
| `Ctrl + W` | Delete word before cursor |
| `Ctrl + R` | Search command history |

## Combining Commands

### Chaining Commands

```bash
# Run sequentially (regardless of success)
command1 ; command2

# Run second only if first succeeds
command1 && command2

# Run second only if first fails
command1 || command2

# Example: create and enter directory
mkdir my-project && cd my-project
```

### Redirecting Output

```bash
# Save output to file (overwrite)
ls > files.txt

# Append to file
echo "new line" >> files.txt

# Redirect errors
command 2> errors.txt

# Redirect both output and errors
command > output.txt 2>&1

# Discard output
command > /dev/null
```

### Piping

```bash
# Send output of one command to another
ls | grep ".js"

# Chain multiple pipes
cat file.txt | grep "error" | wc -l

# Common patterns
history | grep "git"
ps aux | grep "node"
```

## Environment Variables

```bash
# View all environment variables
env             # Mac/Linux
set             # Windows

# View specific variable
echo $PATH      # Mac/Linux
echo %PATH%     # Windows

# Set variable (current session)
export MY_VAR="value"       # Mac/Linux
set MY_VAR=value            # Windows

# Add to PATH
export PATH="$PATH:/new/path"
```

## Common Development Commands

```bash
# Node.js / npm
npm install
npm start
npm run build
npm test

# Git
git status
git add .
git commit -m "message"
git push

# Python
python script.py
pip install package

# Open in VS Code
code .
code filename.txt
```

## Command Reference

| Command | Mac/Linux | Windows |
|---------|-----------|---------|
| List files | `ls` | `dir` |
| Change directory | `cd` | `cd` |
| Print directory | `pwd` | `cd` (no args) |
| Create file | `touch` | `type nul >` |
| Create directory | `mkdir` | `mkdir` |
| Copy | `cp` | `copy` |
| Move/rename | `mv` | `move` / `rename` |
| Delete file | `rm` | `del` |
| Delete directory | `rm -r` | `rmdir /s` |
| View file | `cat` | `type` |
| Clear screen | `clear` | `cls` |

## Summary

- The command line is essential for development
- Navigation: `cd`, `ls`, `pwd`
- Files: `touch`, `cp`, `mv`, `rm`
- Directories: `mkdir`, `rmdir`
- Viewing: `cat`, `head`, `tail`, `less`
- Tab completion saves time
- Combine commands with `&&`, `|`, and redirects

## Next Steps

Learn about [Code Editors](/guide/environment/code-editors) to set up your development environment.
