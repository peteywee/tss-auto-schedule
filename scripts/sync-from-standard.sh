#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STANDARD_DIR="${ROOT_DIR}/../tss-standard"

if [[ ! -d "${STANDARD_DIR}" ]]; then
  echo "ERROR: Standard repo not found at: ${STANDARD_DIR}" >&2
  exit 1
fi

echo "Syncing from standard:"
echo "  FROM: ${STANDARD_DIR}"
echo "  TO:   ${ROOT_DIR}"

# Copy TSSAS folder
rm -rf "${ROOT_DIR}/.top-shelf"
cp -R "${STANDARD_DIR}/.top-shelf" "${ROOT_DIR}/.top-shelf"

# Copy core slice (standard-managed)
mkdir -p "${ROOT_DIR}/src/config" "${ROOT_DIR}/src/core/errors" "${ROOT_DIR}/src/services"

cp -f "${STANDARD_DIR}/src/config/env.ts" "${ROOT_DIR}/src/config/env.ts"
cp -f "${STANDARD_DIR}/src/core/errors/AppError.ts" "${ROOT_DIR}/src/core/errors/AppError.ts"
cp -f "${STANDARD_DIR}/src/services/logger.ts" "${ROOT_DIR}/src/services/logger.ts"
cp -f "${STANDARD_DIR}/src/services/base.service.ts" "${ROOT_DIR}/src/services/base.service.ts"

# Record synced commit hash for auditability
STANDARD_SHA="$(cd "${STANDARD_DIR}" && git rev-parse HEAD)"
cat > "${ROOT_DIR}/.top-shelf/standard.lock" <<EOF
standard_repo_path=../tss-standard
standard_commit=${STANDARD_SHA}
synced_at_utc=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo "OK: synced standard_commit=${STANDARD_SHA}"
