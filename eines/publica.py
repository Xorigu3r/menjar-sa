"""Actualitza aquest repo públic (GitHub Pages) amb la carpeta public/ del repo PRIVAT de l'app.

El codi font continua al repo privat; aquí només hi ha el que ja és públic a la web.
    py -I eines\\publica.py            (copia, fa el commit i el puja)
    py -I eines\\publica.py --prova    (només copia, sense commit)
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ARREL = Path(__file__).resolve().parent.parent
PRIVAT = (ARREL / "eines" / "repo_privat.txt").read_text(encoding="utf-8").strip()
CONSERVA = {".git", ".nojekyll", "README.md", "eines"}           # el que és propi d'aquest repo
FORA = {"_redirects", "assetlinks.json", ".well-known"}           # coses de Cloudflare / de l'arrel del domini


def git(*args, cwd=ARREL):
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True, text=True, encoding="utf-8").stdout


def main():
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "privat"
        subprocess.run(["git", "clone", "-q", "--depth", "1", PRIVAT, str(src)], check=True)
        versio = git("log", "-1", "--format=%h %s", cwd=src).strip()
        for f in ARREL.iterdir():
            if f.name not in CONSERVA:
                shutil.rmtree(f) if f.is_dir() else f.unlink()
        for f in (src / "public").iterdir():
            if f.name in FORA:
                continue
            (shutil.copytree if f.is_dir() else shutil.copy2)(f, ARREL / f.name)
    print(f"Copiat public/ de {PRIVAT} ({versio})")
    if "--prova" in sys.argv:
        return
    git("add", "-A")
    if not git("status", "--porcelain").strip():
        print("No hi ha canvis.")
        return
    git("commit", "-q", "-m", f"Actualitza des del repo privat ({versio})")
    git("push", "-q")
    print("Publicat. GitHub Pages triga 1-2 minuts.")


if __name__ == "__main__":
    main()
