#!/usr/bin/env node
import { buildEventPacket, parseArgs, writeEvent } from "./lib/oracle_fs.mjs";

const args = parseArgs();

const event_type = args.type || args.event_type || "file_edited";
const source_path = args.path || args.source || args._[0] || "";

if (!source_path) {
  console.error("Usage: node scripts/create_event_packet.mjs --type file_created --path relative/path [--notes text] [--dry-run]");
  process.exit(1);
}

const packet = buildEventPacket({
  event_type,
  source_path,
  notes: args.notes || `Generated ${event_type} event for ${source_path}.`,
  recommended_route: args.route
});

if (args["dry-run"]) {
  console.log(JSON.stringify(packet, null, 2));
} else {
  const file = await writeEvent(packet, args.dir || "events/inbox");
  console.log(JSON.stringify({ wrote: file, packet }, null, 2));
}

