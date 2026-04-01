/**
 * China Mirror Plugin Types
 */

export interface MirrorConfig {
  enabled: boolean;
  showHint: boolean;
  silent: boolean;
  preferredMirrors?: Record<string, string>;
}

export interface MirrorSource {
  name: string;
  url: string;
  backer: string;
  checkCmd: string;
  setCmd: string;
  patterns: RegExp[];
}

export interface MirrorHint {
  tool: string;
  mirrorName: string;
  mirrorUrl: string;
  backer: string;
  setCmd: string;
  alreadyConfigured: boolean;
}

export interface ToolCallEvent {
  toolName: string;
  params: Record<string, unknown>;
  sessionId?: string;
  agentId?: string;
}

export interface HookResult {
  message?: string;
}

export interface CommandContext {
  args?: string;
  sessionId?: string;
  agentId?: string;
}

export interface CommandResult {
  content: Array<{ type: string; text: string }>;
}