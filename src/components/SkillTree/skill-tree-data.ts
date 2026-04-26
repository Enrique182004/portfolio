export interface SkillNode {
  id: string;
  label: string;
  proficiency: number;
  projects?: string[];
  children?: SkillNode[];
}

export const SKILL_TREE: SkillNode = {
  id: "root",
  label: "Enrique Calleros",
  proficiency: 1,
  children: [
    {
      id: "frontend",
      label: "Frontend",
      proficiency: 0.95,
      children: [
        {
          id: "react",
          label: "React / Next.js",
          proficiency: 0.95,
          projects: ["Portfolio", "ToDoList"],
        },
        {
          id: "html-css",
          label: "HTML5 / CSS3",
          proficiency: 1,
          projects: ["Portfolio"],
        },
        {
          id: "d3",
          label: "D3.js / Recharts",
          proficiency: 0.75,
          projects: ["Data visualizations"],
        },
        { id: "figma", label: "Figma", proficiency: 0.7 },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      proficiency: 0.9,
      children: [
        {
          id: "nodejs",
          label: "Node.js",
          proficiency: 0.85,
          projects: ["Portfolio", "Crawler"],
        },
        {
          id: "python-web",
          label: "Flask / FastAPI",
          proficiency: 0.85,
          projects: ["Crawler", "ML APIs"],
        },
        { id: "sql-firebase", label: "SQL / Firebase", proficiency: 0.8 },
        {
          id: "docker",
          label: "Docker",
          proficiency: 0.75,
          projects: ["Crawler"],
        },
      ],
    },
    {
      id: "ai-ml",
      label: "AI / ML",
      proficiency: 0.85,
      children: [
        {
          id: "sklearn",
          label: "scikit-learn / XGBoost",
          proficiency: 0.85,
          projects: ["Classifiers"],
        },
        {
          id: "pandas",
          label: "Pandas / NumPy",
          proficiency: 0.9,
          projects: ["Data pipelines"],
        },
        { id: "jupyter", label: "Jupyter", proficiency: 0.9 },
      ],
    },
    {
      id: "other",
      label: "Other",
      proficiency: 0.7,
      children: [
        { id: "java", label: "Java / Java Swing", proficiency: 0.8 },
        { id: "dart", label: "Dart (Flutter)", proficiency: 0.65 },
        { id: "php-haskell", label: "PHP / Haskell", proficiency: 0.5 },
      ],
    },
  ],
};
