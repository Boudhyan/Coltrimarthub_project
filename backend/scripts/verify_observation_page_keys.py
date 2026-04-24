#!/usr/bin/env python3
"""Assert backend accepts page_01..page_54 and legacy keys."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.schemas.observation_schema import is_allowed_observation_page_key


def main() -> None:
    for n in range(1, 55):
        key = f"page_{n:02d}"
        assert is_allowed_observation_page_key(key), key
    assert is_allowed_observation_page_key("mqt_06_1_ini")
    assert is_allowed_observation_page_key("mqt_19_1")
    assert not is_allowed_observation_page_key("page_00")
    assert not is_allowed_observation_page_key("page_55")
    assert not is_allowed_observation_page_key("random")
    print("All page key checks OK (54 PDF pages + 2 legacy).")


if __name__ == "__main__":
    main()
