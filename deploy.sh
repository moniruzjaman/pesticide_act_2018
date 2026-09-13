#!/bin/bash
# ============================================================
# Deploy script — Push Pesticide Act 2018 project to GitHub
# ============================================================
# Run this from your local machine where you have:
#   - SSH keys set up for GitHub (recommended), OR
#   - GitHub CLI (gh) authenticated, OR
#   - A GitHub Personal Access Token (PAT)
#
# USAGE:
#   1. Clone/download this project folder to your machine
#   2. cd into the project root
#   3. bash deploy.sh
# ============================================================

set -e

REPO_SSH="git@github.com:moniruzjaman/pesticide_act_2018.git"
REPO_HTTPS="https://github.com/moniruzjaman/pesticide_act_2018.git"

echo "=========================================="
echo "  Pesticide Act 2018 — GitHub Deploy"
echo "=========================================="
echo ""

# Check if we're in a git repo
if [ ! -d ".git" ]; then
  echo "❌ Not in a git repository. Run this script from the project root."
  exit 1
fi

# Check current branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "📋 Current branch: $BRANCH"
echo "📦 Tracked files: $(git ls-files | wc -l)"
echo "📝 Last commit: $(git log -1 --oneline)"
echo ""

# Ensure remote exists
if ! git remote get-url origin &>/dev/null; then
  echo "➕ Adding remote origin..."
  git remote add origin "$REPO_SSH"
else
  echo "✓ Remote origin already set: $(git remote get-url origin)"
fi

# Ensure on main branch
if [ "$BRANCH" != "main" ]; then
  echo "🔄 Renaming branch to main..."
  git branch -M main
fi

echo ""
echo "=========================================="
echo "  Attempting push via SSH..."
echo "=========================================="

# Try SSH push first
if git push -u origin main 2>&1; then
  echo ""
  echo "✅ SUCCESS! Pushed to $REPO_SSH"
  echo ""
  echo "🌐 View your repo: https://github.com/moniruzjaman/pesticide_act_2018"
  exit 0
fi

echo ""
echo "❌ SSH push failed. Trying HTTPS..."
echo "   (You may need to enter your GitHub username + Personal Access Token)"
echo ""

# Switch to HTTPS and try again
git remote set-url origin "$REPO_HTTPS"
if git push -u origin main 2>&1; then
  echo ""
  echo "✅ SUCCESS! Pushed to $REPO_HTTPS"
  echo ""
  echo "🌐 View your repo: https://github.com/moniruzjaman/pesticide_act_2018"
  exit 0
fi

echo ""
echo "=========================================="
echo "  ❌ Both SSH and HTTPS push failed"
echo "=========================================="
echo ""
echo "Troubleshooting:"
echo ""
echo "1. SSH not set up? Generate a key and add to GitHub:"
echo "   ssh-keygen -t ed25519 -C 'your_email@example.com'"
echo "   cat ~/.ssh/id_ed25519.pub  # copy this"
echo "   # Add at: https://github.com/settings/keys"
echo ""
echo "2. HTTPS needs a Personal Access Token (PAT):"
echo "   # Create at: https://github.com/settings/tokens"
echo "   # When prompted, use your GitHub username + PAT as password"
echo ""
echo "3. Or use GitHub CLI:"
echo "   gh auth login"
echo "   gh repo create moniruzjaman/pesticide_act_2018 --public --source=. --push"
echo ""
echo "4. Repo doesn't exist yet? Create it first:"
echo "   https://github.com/new  (name: pesticide_act_2018, Public)"
echo ""
exit 1
