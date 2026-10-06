import hashlib,subprocess,os,json,sys
paths=sorted(l[3:] for l in subprocess.run(["git","status","--porcelain","--untracked-files=all"],capture_output=True,text=True).stdout.splitlines())
app=[p for p in paths if p.startswith("apps/") and os.path.exists(p)]
H=lambda p:hashlib.sha256(open(p,"rb").read()).hexdigest()
files={p:H(p) for p in app}
pres=["apps/pos-terminal/src/scanner-input.ts","apps/pos-terminal/test/scanner-input.test.ts","apps/pos-terminal/test/scanner-fixtures.ts","apps/pos-terminal/src/connectivity.ts"]
pf={p:H(p) for p in pres}
dig=lambda d:hashlib.sha256("".join(f"{k}\t{v}\n" for k,v in sorted(d.items())).encode()).hexdigest()
out={"files":files,"digest":dig(files),"preserved":pf,"preservedDigest":dig(pf),"paths":paths,"pathsDigest":hashlib.sha256("".join(p+"\n" for p in paths).encode()).hexdigest()}
json.dump(out,open(sys.argv[1],"w"),indent=1)
print(len(files),out["digest"],out["pathsDigest"],out["preservedDigest"])
