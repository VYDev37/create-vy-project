# Stop Slop — Writing & Code Quality Guidelines

## Overview
Guidelines to eliminate AI slop, clichés, unnecessary boilerplate, and robotic writing from both user-facing copy and codebases.

## User-Facing Copy Rules
- **No Em-Dashes (`—`)**: Use clean periods, commas, or parentheses instead.
- **No Overused AI Clichés**: Avoid words like "delve", "testament", "unleash", "elevate", "cutting-edge", "game-changer", "tapestry", "seamlessly".
- **Direct & Action-Oriented**: Write concise, human sentences that respect the user's intelligence and time.
- **Single-Line Desktop Actions**: Navbar, CTAs, and action buttons must not wrap awkwardly on desktop screens.

## Code Quality Rules
- **No Over-Abstraction**: Don't create wrapper classes, utility layers, or adapters for operations that standard libraries already perform cleanly in 1-2 lines.
- **Single Source of Truth**: Derivate types directly from runtime schemas (e.g. Zod `z.infer`) instead of maintaining duplicate TypeScript interfaces.
- **Zero Dead Code**: Remove commented-out code, unused variables, and placeholder files immediately.
