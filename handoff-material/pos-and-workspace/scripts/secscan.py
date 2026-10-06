"""Secret and unsafe-file scan for preservation (scratch tool). Usage: secscan.py <root> <listfile>"""
import io
import os
import re
import sys
import zipfile

PATTERNS = {
    "private-key": re.compile(rb"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    "aws-key": re.compile(rb"AKIA[0-9A-Z]{16}"),
    "github-token": re.compile(rb"(ghp_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}"),
    "openai-style-key": re.compile(rb"\bsk-[A-Za-z0-9_-]{20,}"),
    "slack-token": re.compile(rb"xox[baprs]-[A-Za-z0-9-]{10,}"),
    "google-api-key": re.compile(rb"AIza[0-9A-Za-z_-]{35}"),
    "bearer-literal": re.compile(rb"[Bb]earer\s+[A-Za-z0-9._~+/-]{25,}"),
    "assigned-secret": re.compile(
        rb"(?i)\b(password|passwd|secret|api[_-]?key|access[_-]?token|client[_-]?secret)\b\s*[:=]\s*[\"'][^\"'\s]{6,}[\"']"
    ),
    "connection-string-with-password": re.compile(rb"(?i)(postgres(ql)?|mysql|mongodb)://[^\s:@/]+:[^\s@/]{3,}@"),
}
UNSAFE_NAMES = re.compile(
    r"(^|/)(\.env(\..*)?|.*\.(pem|pfx|p12|key|keystore|jks|sqlite|sqlite3|db|mdb|kdbx)|id_rsa.*|id_ed25519.*)$", re.I
)
MAX = 95 * 1024 * 1024


def scan_bytes(label, data, hits):
    for name, pat in PATTERNS.items():
        for m in pat.finditer(data):
            snippet = m.group(0)[:60].decode("utf-8", "replace")
            hits.append((label, name, snippet))
            break


def scan_file(root, rel, hits):
    path = os.path.join(root, rel)
    if UNSAFE_NAMES.search(rel.replace("\\", "/")):
        hits.append((rel, "unsafe-filename", ""))
    size = os.path.getsize(path)
    if size > MAX:
        hits.append((rel, "too-large", str(size)))
        return
    with open(path, "rb") as fh:
        data = fh.read()
    if rel.lower().endswith(".zip"):
        try:
            with zipfile.ZipFile(io.BytesIO(data)) as z:
                for info in z.infolist():
                    if info.is_dir():
                        continue
                    if UNSAFE_NAMES.search(info.filename):
                        hits.append((rel + "!" + info.filename, "unsafe-filename", ""))
                    if info.file_size > 40 * 1024 * 1024:
                        continue
                    scan_bytes(rel + "!" + info.filename, z.read(info), hits)
        except zipfile.BadZipFile:
            hits.append((rel, "bad-zip", ""))
    else:
        scan_bytes(rel, data, hits)


def main():
    root, listfile = sys.argv[1], sys.argv[2]
    hits = []
    n = 0
    for line in io.open(listfile, encoding="utf-8"):
        rel = line.rstrip("\r\n")
        if not rel or not os.path.isfile(os.path.join(root, rel)):
            continue
        scan_file(root, rel, hits)
        n += 1
    print(f"scanned {n} files, hits {len(hits)}")
    for h in hits:
        print("HIT", *h)


main()
