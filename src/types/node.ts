export type NodeId =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "ai-ml"
  | "contact";

export interface NodeConfig {
  id: NodeId;
  label: string;
  xRatio: number;
  yRatio: number;
}
