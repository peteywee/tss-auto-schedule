# Schedule Feature (Foundation)

This feature contains pure domain types and deterministic utilities:
- ISODate ("YYYY-MM-DD") and HH:mm time strings
- Pay period calculation (Wed..Tue, 14 days)
- Week grouping (Wed..Tue, 7 days)
- Hour calculation between HH:mm values

Rules:
- Utilities must remain pure and unit-testable.
- Avoid implicit local timezone math.
- Use ISODate + UTC-based day arithmetic.
