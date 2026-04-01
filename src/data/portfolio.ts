export type NodeType =
  | "about"
  | "education"
  | "experience"
  | "project"
  | "contribution"
  | "skill";

export interface PortfolioNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  links?: { label: string; url: string; icon: "github" | "demo" | "article" | "linkedin" | "email" }[];
  date?: string;
  cluster: "about" | "experience" | "projects" | "opensource" | "skills" | "contact";
  weight: number; // 1–5, affects node size
}

export interface PortfolioEdge {
  source: string;
  target: string;
  strength: number; // 0–1
}

// ─── NODES ────────────────────────────────────────────────────────────────────

export const nodes: PortfolioNode[] = [
  // ABOUT
  {
    id: "about-luca",
    type: "about",
    title: "Luca Tam",
    subtitle: "Computer Engineer & AI Researcher",
    description:
      "Computer Engineering graduate (BSc 110/110 with honors) from Sapienza University of Rome, currently pursuing a Master's degree. I build at the intersection of Large Language Models, 3D web experiences, and open source tooling. Former Google Summer of Code contributor, open source contributor to OpenVINO, and AI intern at Babelscape.",
    tags: ["AI", "3D Web", "Open Source", "Rome, Italy"],
    links: [
      { label: "GitHub", url: "https://github.com/LucaTamSapienza", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com/in/luca-tam", icon: "linkedin" },
      { label: "Email", url: "mailto:luca.tam04@gmail.com", icon: "email" },
    ],
    cluster: "about",
    weight: 5,
  },

  // EDUCATION
  {
    id: "edu-masters",
    type: "education",
    title: "M.Sc. Computer Science",
    subtitle: "Sapienza University of Rome · 2025–2027",
    description:
      "Master's Degree in Engineering in Computer Science at Sapienza University of Rome. Expected graduation July 2027. Focus on advanced algorithms, machine learning systems, and distributed computing.",
    tags: ["Computer Science", "Machine Learning", "Research"],
    cluster: "about",
    weight: 3,
  },
  {
    id: "edu-bachelors",
    type: "education",
    title: "B.Sc. Computer Engineering",
    subtitle: "Sapienza University of Rome · 110/110 with honors",
    description:
      "Bachelor's Degree in Computer Engineering from Sapienza University of Rome. Graduated with maximum score 110/110 cum laude (highest distinction). Coursework covered Python, Java, C, C++, SQL, Assembly, algorithms, operating systems, computer networks.",
    tags: ["Computer Engineering", "110/110 honors", "Sapienza"],
    cluster: "about",
    weight: 4,
  },

  // EXPERIENCE
  {
    id: "exp-babelscape",
    type: "experience",
    title: "Software Engineer Intern",
    subtitle: "Babelscape · Oct 2025–Present",
    description:
      "Developing Minerva Web — a web-based Retrieval-Augmented Generation (RAG) system for Italy's largest open-source Large Language Model. Responsible for the full model lifecycle: finetuning various local LLMs and rigorously benchmarking their performance and accuracy. Working with PyTorch, Python, FastAPI, and modern NLP pipelines.",
    tags: ["RAG", "LLM", "Finetuning", "PyTorch", "NLP", "Python"],
    cluster: "experience",
    weight: 5,
  },
  {
    id: "exp-gsoc",
    type: "experience",
    title: "Google Summer of Code",
    subtitle: "OpenVINO · June–Sept 2024",
    description:
      "Developed a PyTorch adapter proof-of-concept using OpenVINO's Python API, enabling users to replace PyTorch imports with a single line: `import torch_adapter as torch`. Focused on PrePostProcessing for model input handling and inference on pretrained models from PyTorch Hub (e.g., ResNet18). Published a Medium article and official GSoC project summary.",
    tags: ["Python", "PyTorch", "OpenVINO", "Deep Learning", "Open Source"],
    links: [
      { label: "Medium Article", url: "https://medium.com", icon: "article" },
      { label: "GSoC Page", url: "https://summerofcode.withgoogle.com", icon: "demo" },
    ],
    cluster: "experience",
    weight: 5,
  },

  // PROJECTS
  {
    id: "proj-museion",
    type: "project",
    title: "Museion",
    subtitle: "Interactive 3D Virtual Museum · museion.space",
    description:
      "Interactive 3D virtual museum tour built with a 3-person agile team. Features immersive Three.js scenes built with React Three Fiber and Drei, custom 3D assets modeled in Blender, a full-stack backend using Node.js + Next.js + PostgreSQL, Docker for development, and deployed on Neon + Vercel.",
    tags: ["Three.js", "React Three Fiber", "Next.js", "Node.js", "PostgreSQL", "Blender", "Docker"],
    links: [
      { label: "GitHub", url: "https://github.com/LorenzoVentrone/museion", icon: "github" },
      { label: "Live Demo", url: "https://museion.space", icon: "demo" },
    ],
    cluster: "projects",
    weight: 5,
  },
  {
    id: "proj-faqbuddy",
    type: "project",
    title: "FAQBuddy",
    subtitle: "AI University Chatbot · faqbuddy.net",
    description:
      "Low-budget university platform featuring an on-premise chatbot that blends Retrieval-Augmented Generation (RAG) and text-to-SQL for sub-second answers. Next.js frontend, FastAPI backend with Python, PostgreSQL database with vector search, deployed via Neon + Vercel + Render. Showcases practical RAG architecture on minimal infrastructure.",
    tags: ["RAG", "LLM", "Next.js", "FastAPI", "PostgreSQL", "Python", "ML"],
    links: [
      { label: "GitHub", url: "https://github.com/prollyyes/faqbuddy", icon: "github" },
      { label: "Live Demo", url: "https://faqbuddy.net", icon: "demo" },
    ],
    cluster: "projects",
    weight: 5,
  },

  // OPEN SOURCE CONTRIBUTIONS
  {
    id: "contrib-openvino-python",
    type: "contribution",
    title: "OpenVINO Python API",
    subtitle: "openvinotoolkit/openvino · Dec 2023–Apr 2024",
    description:
      "Contributed to the Python OpenVINO API: supported Slice and Negative Index for Shape and PartialShape types, and extended name appending functionality across all opsets. These changes improved API ergonomics for Python users working with model shapes.",
    tags: ["Python", "OpenVINO", "C++", "Open Source"],
    links: [
      { label: "GitHub", url: "https://github.com/openvinotoolkit/openvino", icon: "github" },
    ],
    cluster: "opensource",
    weight: 4,
  },
  {
    id: "contrib-openvino-pytorch",
    type: "contribution",
    title: "OpenVINO PyTorch Frontend",
    subtitle: "openvinotoolkit/openvino · Dec 2023–Apr 2024",
    description:
      "Implemented several operations for the PyTorch frontend in OpenVINO: Aminmax, Dot, and expm1 operations. These additions expanded the set of PyTorch models that can be converted and run efficiently with OpenVINO's inference engine.",
    tags: ["PyTorch", "OpenVINO", "C++", "Neural Networks"],
    links: [
      { label: "GitHub", url: "https://github.com/openvinotoolkit/openvino", icon: "github" },
    ],
    cluster: "opensource",
    weight: 4,
  },
  {
    id: "contrib-openvino-tensorflow",
    type: "contribution",
    title: "OpenVINO TensorFlow Frontend",
    subtitle: "openvinotoolkit/openvino · Dec 2023–Apr 2024",
    description:
      "Extended existing operations in the TensorFlow frontend to support complex Tensors: Size, AddN, and Round operations. This work enabled TensorFlow models using complex tensor arithmetic to be properly converted to OpenVINO IR format.",
    tags: ["TensorFlow", "OpenVINO", "C++", "ONNX"],
    links: [
      { label: "GitHub", url: "https://github.com/openvinotoolkit/openvino", icon: "github" },
    ],
    cluster: "opensource",
    weight: 4,
  },

  // SKILLS — Core AI/ML
  {
    id: "skill-python",
    type: "skill",
    title: "Python",
    description: "Primary language. Used across all ML, backend, and scripting work. Deep expertise with Python ecosystem: NumPy, PyTorch, scikit-learn, FastAPI, llama_cpp_python.",
    tags: ["Python", "Language"],
    cluster: "skills",
    weight: 5,
  },
  {
    id: "skill-pytorch",
    type: "skill",
    title: "PyTorch",
    description: "Neural network framework. Used for finetuning LLMs, building adapters, benchmarking models, and deep learning research at Babelscape and GSoC.",
    tags: ["PyTorch", "Deep Learning", "ML"],
    cluster: "skills",
    weight: 5,
  },
  {
    id: "skill-llm",
    type: "skill",
    title: "LLMs & RAG",
    description: "Large Language Models and Retrieval-Augmented Generation. Built RAG systems (Minerva Web, FAQBuddy), finetuned local LLMs, worked with llama_cpp_python, vector search, and embedding pipelines.",
    tags: ["LLM", "RAG", "NLP", "Embeddings"],
    cluster: "skills",
    weight: 5,
  },
  {
    id: "skill-openvino",
    type: "skill",
    title: "OpenVINO",
    description: "Intel's open-source toolkit for optimizing and deploying neural network inference. Contributed to the codebase at C++ and Python level; built PyTorch adapter POC for GSoC.",
    tags: ["OpenVINO", "ONNX", "Inference", "Optimization"],
    cluster: "skills",
    weight: 4,
  },

  // SKILLS — 3D Web
  {
    id: "skill-threejs",
    type: "skill",
    title: "Three.js",
    description: "JavaScript 3D library for WebGL. Built Museion's virtual museum environment, 3D scene management, lighting, and interactive object handling.",
    tags: ["Three.js", "WebGL", "3D", "JavaScript"],
    cluster: "skills",
    weight: 5,
  },
  {
    id: "skill-r3f",
    type: "skill",
    title: "React Three Fiber",
    description: "React renderer for Three.js. Declarative 3D scenes, hooks-based interaction (useFrame, useThree), Drei helpers, and postprocessing effects.",
    tags: ["React Three Fiber", "Three.js", "React", "3D"],
    cluster: "skills",
    weight: 5,
  },
  {
    id: "skill-blender",
    type: "skill",
    title: "Blender",
    description: "3D modeling and animation software. Created custom assets for Museion museum tour — GLTF exports optimized for web rendering.",
    tags: ["Blender", "3D Modeling", "GLTF"],
    cluster: "skills",
    weight: 3,
  },

  // SKILLS — Web Dev
  {
    id: "skill-nextjs",
    type: "skill",
    title: "Next.js",
    description: "React framework for production. Used in Museion and FAQBuddy — App Router, server components, API routes, and Vercel deployment.",
    tags: ["Next.js", "React", "TypeScript", "Web"],
    cluster: "skills",
    weight: 4,
  },
  {
    id: "skill-fastapi",
    type: "skill",
    title: "FastAPI",
    description: "Python web framework for building async APIs. Used as the backend for FAQBuddy, serving RAG and text-to-SQL endpoints with sub-second response times.",
    tags: ["FastAPI", "Python", "API", "Backend"],
    cluster: "skills",
    weight: 4,
  },
  {
    id: "skill-postgres",
    type: "skill",
    title: "PostgreSQL",
    description: "Relational database with vector extension support. Used in both Museion and FAQBuddy for application data and embedding vector storage.",
    tags: ["PostgreSQL", "SQL", "Database", "pgvector"],
    cluster: "skills",
    weight: 3,
  },
  {
    id: "skill-docker",
    type: "skill",
    title: "Docker",
    description: "Container platform for development and deployment. Used in Museion for reproducible dev environments with Docker Compose.",
    tags: ["Docker", "DevOps", "Containers"],
    cluster: "skills",
    weight: 3,
  },

  // SKILLS — Systems
  {
    id: "skill-cpp",
    type: "skill",
    title: "C / C++",
    description: "Systems programming languages. Used in OpenVINO contributions for implementing neural network operations in the C++ inference engine core.",
    tags: ["C++", "C", "Systems", "Performance"],
    cluster: "skills",
    weight: 3,
  },
  {
    id: "skill-git",
    type: "skill",
    title: "Git & GitHub",
    description: "Version control and collaborative development. Active contributor to large open source repositories — PR workflows, code reviews, CI/CD pipelines.",
    tags: ["Git", "GitHub", "Open Source", "Collaboration"],
    cluster: "skills",
    weight: 4,
  },
];

// ─── EDGES ────────────────────────────────────────────────────────────────────

export const edges: PortfolioEdge[] = [
  // About ↔ Education
  { source: "about-luca", target: "edu-masters", strength: 0.9 },
  { source: "about-luca", target: "edu-bachelors", strength: 0.9 },
  { source: "edu-bachelors", target: "edu-masters", strength: 0.7 },

  // About ↔ Core skills (identity connections)
  { source: "about-luca", target: "skill-python", strength: 0.8 },
  { source: "about-luca", target: "skill-llm", strength: 0.9 },
  { source: "about-luca", target: "skill-threejs", strength: 0.8 },
  { source: "about-luca", target: "skill-git", strength: 0.7 },

  // Experience — Babelscape
  { source: "exp-babelscape", target: "skill-llm", strength: 1.0 },
  { source: "exp-babelscape", target: "skill-pytorch", strength: 0.9 },
  { source: "exp-babelscape", target: "skill-python", strength: 0.9 },
  { source: "exp-babelscape", target: "skill-fastapi", strength: 0.6 },
  { source: "exp-babelscape", target: "proj-faqbuddy", strength: 0.5 },

  // Experience — GSoC
  { source: "exp-gsoc", target: "skill-openvino", strength: 1.0 },
  { source: "exp-gsoc", target: "skill-pytorch", strength: 0.9 },
  { source: "exp-gsoc", target: "skill-python", strength: 0.8 },
  { source: "exp-gsoc", target: "skill-git", strength: 0.7 },
  { source: "exp-gsoc", target: "contrib-openvino-python", strength: 0.6 },

  // Project — Museion
  { source: "proj-museion", target: "skill-threejs", strength: 1.0 },
  { source: "proj-museion", target: "skill-r3f", strength: 1.0 },
  { source: "proj-museion", target: "skill-blender", strength: 0.9 },
  { source: "proj-museion", target: "skill-nextjs", strength: 0.8 },
  { source: "proj-museion", target: "skill-postgres", strength: 0.6 },
  { source: "proj-museion", target: "skill-docker", strength: 0.6 },
  { source: "proj-museion", target: "skill-git", strength: 0.5 },

  // Project — FAQBuddy
  { source: "proj-faqbuddy", target: "skill-llm", strength: 1.0 },
  { source: "proj-faqbuddy", target: "skill-nextjs", strength: 0.8 },
  { source: "proj-faqbuddy", target: "skill-fastapi", strength: 0.9 },
  { source: "proj-faqbuddy", target: "skill-postgres", strength: 0.7 },
  { source: "proj-faqbuddy", target: "skill-python", strength: 0.8 },

  // Contributions — OpenVINO
  { source: "contrib-openvino-python", target: "skill-openvino", strength: 0.9 },
  { source: "contrib-openvino-python", target: "skill-python", strength: 0.8 },
  { source: "contrib-openvino-python", target: "skill-cpp", strength: 0.6 },
  { source: "contrib-openvino-pytorch", target: "skill-pytorch", strength: 1.0 },
  { source: "contrib-openvino-pytorch", target: "skill-openvino", strength: 0.9 },
  { source: "contrib-openvino-pytorch", target: "skill-cpp", strength: 0.8 },
  { source: "contrib-openvino-tensorflow", target: "skill-openvino", strength: 0.9 },
  { source: "contrib-openvino-tensorflow", target: "skill-cpp", strength: 0.8 },

  // Cross-cluster connections
  { source: "skill-pytorch", target: "skill-openvino", strength: 0.7 },
  { source: "skill-threejs", target: "skill-r3f", strength: 0.9 },
  { source: "skill-nextjs", target: "skill-fastapi", strength: 0.5 },
  { source: "skill-llm", target: "skill-pytorch", strength: 0.8 },
  { source: "skill-llm", target: "skill-postgres", strength: 0.5 },
  { source: "contrib-openvino-python", target: "contrib-openvino-pytorch", strength: 0.8 },
  { source: "contrib-openvino-pytorch", target: "contrib-openvino-tensorflow", strength: 0.7 },

  // Experience connections
  { source: "about-luca", target: "exp-babelscape", strength: 0.9 },
  { source: "about-luca", target: "exp-gsoc", strength: 0.9 },
  { source: "about-luca", target: "proj-museion", strength: 0.8 },
  { source: "about-luca", target: "proj-faqbuddy", strength: 0.8 },
  { source: "about-luca", target: "contrib-openvino-python", strength: 0.7 },
];

export const portfolioData = { nodes, edges };
export default portfolioData;
