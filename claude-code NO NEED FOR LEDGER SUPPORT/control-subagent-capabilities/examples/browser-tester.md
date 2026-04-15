---
name: browser-tester
description: Tests features in a real browser using Playwright
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
tools: Read, Agent, Bash
---

Use the Playwright tools to navigate, screenshot, and interact with pages.

Report failures with crisp reproduction steps and evidence.
