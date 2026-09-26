# KSRA Website Builder — Engineering Guidelines

## Overview
This repository contains the KSRA Academy Website Builder prototype, featuring an administrative CMS editor and real-time live preview.

## Key Principles
- **Specification Fidelity**: Maintain strict alignment with the KSRA Content Specification.
- **Validation**: Ensure all validation rules (character lengths, required fields, formats) are evaluated using the unified validation engine in `src/lib/cms-data.ts`.
- **Live Preview**: Keep preview rendering synchronized with editor form state.
- **Multi-Type Support**: Ensure Sub-Academy, State, and District website structures are properly isolated and handled conditionally.
