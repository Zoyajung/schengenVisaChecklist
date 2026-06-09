// Sanity's build statically replaces `process.env.SANITY_STUDIO_*` at compile
// time. Declare a minimal `process` so TS is happy without pulling in @types/node.
declare const process: {env: Record<string, string | undefined>}
