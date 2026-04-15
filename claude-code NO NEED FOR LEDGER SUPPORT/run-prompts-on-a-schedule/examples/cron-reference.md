# Cron Reference

Examples:

- `*/5 * * * *` = every 5 minutes
- `0 * * * *` = every hour on the hour
- `7 * * * *` = every hour at 7 minutes past
- `0 9 * * *` = every day at 9am local
- `0 9 * * 1-5` = weekdays at 9am local
- `30 14 15 3 *` = March 15 at 2:30pm local

Notes:
- 5-field cron only
- no `L`, `W`, `?`, or month/day name aliases
- if both day-of-month and day-of-week are constrained, either match is enough
