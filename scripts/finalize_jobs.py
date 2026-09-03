from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

import fix_job_geo


DATA_PATH = Path(__file__).resolve().parents[1] / 'jobs-data.json'


def main() -> None:
    # Reuse the validated geography cleanup and its 8-region publication guard.
    fix_job_geo.main()

    data = json.loads(DATA_PATH.read_text(encoding='utf-8'))
    jobs = data.get('jobs', []) if isinstance(data, dict) else data
    if not isinstance(data, dict) or not isinstance(jobs, list):
        raise SystemExit('jobs-data.json does not contain the expected object/jobs structure')

    counts = Counter(job.get('region') or 'Neurčený kraj' for job in jobs)
    nationwide = counts.get('Celé Slovensko', 0)
    unresolved = [
        job for job in jobs
        if job.get('region') not in fix_job_geo.SLOVAK_REGIONS
        and job.get('region') != 'Celé Slovensko'
    ]
    if unresolved:
        raise SystemExit(f'Refusing to publish: {len(unresolved)} unresolved vacancy locations remain')

    data['schemaVersion'] = max(int(data.get('schemaVersion') or 0), 9)
    data['regionCounts'] = dict(sorted(counts.items()))
    data['nationwideCount'] = nationwide
    data['unresolvedCount'] = 0
    data['jobCount'] = len(jobs)
    data['geoPostProcessed'] = True

    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('finalized jobs', len(jobs), 'nationwide', nationwide, 'unresolved', 0)
    print('final region counts', json.dumps(data['regionCounts'], ensure_ascii=False))


if __name__ == '__main__':
    main()
