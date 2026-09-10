from __future__ import annotations

"""Compatibility runner for the current Služby zamestnanosti vacancy detail labels.

Keeps the stable broad VPM collector untouched while teaching it the labels that
are currently rendered by the official portal (Prax, Cudzí jazyk, Zmennosť,
Pracovný a mimopracovný pomer) and plus-style driving licence groups (C+E).

If the official portal temporarily refuses/terminates all network requests, keep
the last production jobs-data.json instead of replacing it with an incomplete
feed or failing the scheduled workflow. All other validation failures still fail.
"""

import json
import re
from pathlib import Path

import update_jobs as jobs


ALIASES = {
    'Požadovaná prax': ['Požadovaná prax', 'Prax'],
    'Požadované cudzie jazyky': ['Požadované cudzie jazyky', 'Cudzí jazyk', 'Cudzie jazyky'],
    'Pracovný pomer': ['Pracovný pomer', 'Pracovný a mimopracovný pomer'],
    'Práca na zmeny': ['Práca na zmeny', 'Zmennosť'],
}

for heading in [
    'Cudzí jazyk',
    'Cudzie jazyky',
    'Zmennosť',
    'Pracovný a mimopracovný pomer',
    'Znalosť jazyka požaduje',
]:
    if heading not in jobs.SECTION_HEADINGS:
        jobs.SECTION_HEADINGS.append(heading)

_original_value_after = jobs.value_after
_original_values_between = jobs.values_between
_original_clean_driving_licenses = jobs.clean_driving_licenses


def value_after(lines, label, lookahead=10):
    for candidate in ALIASES.get(label, [label]):
        value = _original_value_after(lines, candidate, lookahead)
        if value:
            return value
    return ''


def values_between(lines, label, stop_labels=(), max_items=12):
    for candidate in ALIASES.get(label, [label]):
        values = _original_values_between(lines, candidate, stop_labels, max_items)
        if values:
            return values
    return []


def clean_driving_licenses(values):
    normalized = []
    replacements = {
        r'\bC1\s*\+\s*E\b': 'C1E',
        r'\bC\s*\+\s*E\b': 'CE',
        r'\bD1\s*\+\s*E\b': 'D1E',
        r'\bD\s*\+\s*E\b': 'DE',
        r'\bB\s*\+\s*E\b': 'BE',
    }
    for value in values:
        text = str(value or '')
        for pattern, replacement in replacements.items():
            text = re.sub(pattern, replacement, text, flags=re.I)
        normalized.append(text)
    return _original_clean_driving_licenses(normalized)


def has_safe_existing_database() -> tuple[bool, int]:
    """Return whether the current production DB is safe enough to preserve."""
    path = Path(__file__).resolve().parents[1] / 'jobs-data.json'
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
        existing = data.get('jobs', []) if isinstance(data, dict) else data
        count = len(existing) if isinstance(existing, list) else 0
        return count >= jobs.MIN_JOBS_TO_PUBLISH, count
    except Exception:
        return False, 0


def run() -> None:
    try:
        jobs.main()
    except SystemExit as exc:
        message = str(exc)
        # update_jobs.main() raises this exact class of error before writing the
        # file. Treat it as a temporary upstream outage only when a healthy
        # production database already exists locally. finalize_jobs.py runs next
        # and still enforces geography / region publication guards.
        if message.startswith('Only ') and 'vacancies fetched; refusing to replace production database' in message:
            safe, count = has_safe_existing_database()
            if safe:
                print(f'Upstream vacancy feed unavailable/incomplete; preserving existing {count}-job production database')
                return
        raise


jobs.value_after = value_after
jobs.values_between = values_between
jobs.clean_driving_licenses = clean_driving_licenses


if __name__ == '__main__':
    run()
