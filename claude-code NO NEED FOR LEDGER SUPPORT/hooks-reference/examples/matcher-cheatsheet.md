| Event | Matcher filters | Example values |
|---|---|---|
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied` | tool name | `Bash`, `Edit|Write`, `mcp__.*` |
| `SessionStart` | startup source | `startup`, `resume`, `clear`, `compact` |
| `SessionEnd` | exit reason | `clear`, `resume`, `logout`, `other` |
| `Notification` | notification type | `permission_prompt`, `idle_prompt` |
| `SubagentStart`, `SubagentStop` | agent type | `Explore`, `Plan`, custom names |
| `PreCompact`, `PostCompact` | compaction trigger | `manual`, `auto` |
| `ConfigChange` | config source | `user_settings`, `project_settings`, `skills` |
| `InstructionsLoaded` | load reason | `session_start`, `nested_traversal`, `include`, `compact` |
| `Elicitation`, `ElicitationResult` | MCP server name | your configured server names |
