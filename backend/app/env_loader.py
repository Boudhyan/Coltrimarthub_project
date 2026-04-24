"""Load .env from known locations (repo root and backend/) so values are always found."""
from __future__ import annotations

import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# This file is backend/app/env_loader.py → backend dir is parent.parent
_BACKEND_DIR = Path(__file__).resolve().parent.parent


def backend_dotenv_paths() -> list[Path]:
    """Least specific first, most specific last — each load uses override=True."""
    repo = _BACKEND_DIR.parent
    return [repo / ".env", _BACKEND_DIR / ".env"]


def load_backend_dotenv(*, override: bool = True, quiet: bool = False) -> list[Path]:
    """
    Load environment variables from .env file(s).
    Returns list of paths that were read (non-empty files).
    Use quiet=True for per-request reloads to avoid log spam.
    """
    try:
        from dotenv import load_dotenv
    except ImportError:
        if not quiet:
            logger.warning("python-dotenv is not installed; .env will not be loaded")
        return []

    loaded: list[Path] = []
    for path in backend_dotenv_paths():
        if not path.is_file():
            continue
        try:
            if path.stat().st_size == 0:
                if not quiet:
                    logger.warning(
                        ".env is empty (0 bytes): %s — save the file in your editor",
                        path,
                    )
                continue
        except OSError:
            continue
        load_dotenv(path, override=override)
        loaded.append(path)

    if not loaded and not quiet:
        logger.warning(
            "No .env loaded. Expected a non-empty file at %s or %s",
            backend_dotenv_paths()[0],
            backend_dotenv_paths()[1],
        )
    return loaded
