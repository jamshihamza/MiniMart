"""Inventory the original checkout's pending files: size, sha256, git blob id, duplicates (scratch tool)."""
import hashlib
import json
import subprocess
import sys

REPO = "D:/Projects/MiniMart"


def git(*args, text=False):
    r = subprocess.run(["git", "-C", REPO, *args], capture_output=True)
    return r.stdout.decode("utf-8") if text else r.stdout


staged = [n for n in git("diff", "--cached", "--name-only", "-z").split(b"\0") if n]
staged = sorted(n.decode("utf-8") for n in staged)
untracked = [
    n.decode("utf-8")
    for n in git("ls-files", "--others", "--exclude-standard", "-z").split(b"\0")
    if n
]
untracked = sorted(untracked)

# blob ids of everything already tracked at HEAD, to find duplicates of tracked files
tracked = {}
for line in git("ls-tree", "-r", "-z", "HEAD").split(b"\0"):
    if not line:
        continue
    meta, path = line.split(b"\t", 1)
    tracked.setdefault(meta.split()[2].decode(), []).append(path.decode("utf-8"))

rows = []
for kind, names in (("staged", staged), ("untracked", untracked)):
    for n in names:
        if kind == "staged":
            blob = git("rev-parse", ":" + n).decode().strip()
            data = git("cat-file", "blob", blob)
        else:
            with open(f"{REPO}/{n}", "rb") as fh:
                data = fh.read()
            blob = subprocess.run(
                ["git", "-C", REPO, "hash-object", "--stdin"], input=data, capture_output=True
            ).stdout.decode().strip()
        rows.append(
            {
                "path": n,
                "state": kind,
                "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(),
                "blob": blob,
                "same_as_tracked": tracked.get(blob, []),
            }
        )
by_hash = {}
for r in rows:
    by_hash.setdefault(r["sha256"], []).append(r["path"])
for r in rows:
    r["identical_to_other_pending"] = [p for p in by_hash[r["sha256"]] if p != r["path"]]
json.dump(rows, open(sys.argv[1], "w", encoding="utf-8"), indent=1)
print(len(staged), len(untracked))
for r in rows:
    if r["same_as_tracked"] or r["identical_to_other_pending"]:
        print("DUP", r["path"], r["same_as_tracked"], r["identical_to_other_pending"])
