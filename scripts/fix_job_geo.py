from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / 'jobs-data.json'
SLOVAK_REGIONS = {
    'Bratislavský kraj',
    'Trnavský kraj',
    'Trenčiansky kraj',
    'Nitriansky kraj',
    'Žilinský kraj',
    'Banskobystrický kraj',
    'Prešovský kraj',
    'Košický kraj',
}
FOREIGN_PREFIXES = (
    'rakúsko', 'rakusko', 'česko', 'cesko', 'česká republika', 'ceska republika',
    'maďarsko', 'madarsko', 'poľsko', 'polsko', 'nemecko', 'holandsko', 'belgicko',
    'švajčiarsko', 'svajciarsko', 'francúzsko', 'francuzsko', 'taliansko',
)


def norm(value: object) -> str:
    return ' '.join(str(value or '').strip().lower().split())


def clean_geo_text(value: object) -> str:
    """Remove UI labels accidentally captured from the official vacancy page."""
    text = ' '.join(str(value or '').strip().split())
    if not text:
        return ''
    for marker in (
        r'\s+location_on\b',
        r'\s+Dátum nástupu\b',
        r'\s+Základná zložka mzdy\b',
        r'\s+Údaje o pracovnej pozícii\b',
    ):
        text = re.split(marker, text, maxsplit=1, flags=re.I)[0].strip()
    return text


def clean_job_geography(job: dict) -> dict:
    job['location'] = clean_geo_text(job.get('location'))
    job['city'] = clean_geo_text(job.get('city'))
    job['district'] = clean_geo_text(job.get('district'))

    # Some portal records expose "city - district" as one captured city value.
    if ' - ' in job['city']:
        city, district = [part.strip() for part in job['city'].split(' - ', 1)]
        if city:
            job['city'] = city
        if district and not job['district']:
            job['district'] = district

    # Kept records are Slovak after the foreign filter below; normalize the field
    # because the source markup sometimes puts the street into `country`.
    job['country'] = 'Slovensko'
    return job


def is_nationwide(job: dict) -> bool:
    region = norm(job.get('region'))
    location = norm(job.get('location'))
    country = norm(job.get('country'))
    if region == 'celé slovensko':
        return True
    if location in {'slovensko', 'slovenská republika', 'slovenska republika', 'slovensko, okolie'}:
        return True
    if location.startswith('slovensko, okolie'):
        return True
    if country == 'slovensko' and not norm(job.get('city')) and not norm(job.get('district')):
        return True
    return False


def is_foreign(job: dict) -> bool:
    location = norm(job.get('location'))
    country = norm(job.get('country'))
    return any(location.startswith(x) or country.startswith(x) for x in FOREIGN_PREFIXES)


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding='utf-8'))
    jobs = data.get('jobs', []) if isinstance(data, dict) else data
    if not isinstance(jobs, list):
        raise SystemExit('jobs-data.json does not contain a jobs list')

    cleaned = []
    nationwide_fixed = 0
    foreign_removed = 0
    geo_noise_fixed = 0
    for raw_job in jobs:
        if not isinstance(raw_job, dict):
            continue
        job = dict(raw_job)
        if is_foreign(job):
            foreign_removed += 1
            continue

        before = (job.get('location'), job.get('city'), job.get('district'), job.get('country'))
        job = clean_job_geography(job)
        after = (job.get('location'), job.get('city'), job.get('district'), job.get('country'))
        if before != after:
            geo_noise_fixed += 1

        if is_nationwide(job):
            if job.get('region') != 'Celé Slovensko' or job.get('location') != 'Celé Slovensko':
                nationwide_fixed += 1
            job['location'] = 'Celé Slovensko'
            job['city'] = ''
            job['district'] = ''
            job['region'] = 'Celé Slovensko'
            job['postalCode'] = ''
            job['country'] = 'Slovensko'
        cleaned.append(job)

    present = {job.get('region') for job in cleaned}
    missing = sorted(SLOVAK_REGIONS - present)
    if missing:
        raise SystemExit('Refusing to publish: missing Slovak regions: ' + ', '.join(missing))

    polluted = [
        job for job in cleaned
        if 'location_on' in norm(job.get('location'))
        or 'location_on' in norm(job.get('city'))
        or 'location_on' in norm(job.get('district'))
    ]
    if polluted:
        raise SystemExit(f'Refusing to publish: {len(polluted)} vacancy locations still contain UI noise')

    if isinstance(data, dict):
        data['jobs'] = cleaned
        data['jobCount'] = len(cleaned)
        data['geoPostProcessed'] = True
    else:
        data = cleaned

    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    counts = Counter(job.get('region') or 'Neurčený kraj' for job in cleaned)
    print('geo post-process jobs', len(cleaned), 'nationwide fixed', nationwide_fixed, 'foreign removed', foreign_removed, 'geo noise fixed', geo_noise_fixed)
    print('geo post-process region counts', json.dumps(dict(sorted(counts.items())), ensure_ascii=False))


if __name__ == '__main__':
    main()
