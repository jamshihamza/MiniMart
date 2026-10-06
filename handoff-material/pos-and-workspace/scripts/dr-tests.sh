#!/bin/sh
# usage: dr-tests.sh <worktree> <outfile>
cd "$1" && node --test --test-reporter=tap tools/design-render/tests/*.test.mjs > "$2" 2>&1
