import { text, select, isCancel, cancel } from "@clack/prompts";

export type Answers = {
  projectName: string;
  type: "fullstack" | "frontend+backend" | "frontend" | "backend";
  frontend?: "nextjs-fullstack" | "nextjs-frontend" | "react-vite";
  backend?: "go-fiber" | "laravel";
  username?: string;
};

export async function runPrompts(): Promise<Answers> {
  // 1. Project name
  const projectName = await text({
    message: "Project name:",
    placeholder: "my-app",
    defaultValue: "my-app",
    validate: (value) => {
      if (!value || !value.trim()) return "Project name cannot be empty";
      if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
        return "Project name can only contain letters, numbers, hyphens, and underscores";
      }
      return;
    },
  });

  if (isCancel(projectName)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  // 2. Project type
  const type = await select({
    message: "Select project type:",
    options: [
      {
        value: "backend",
        label: "Backend only",
        hint: "API server / microservice",
      },
      {
        value: "fullstack",
        label: "Fullstack (Next.js)",
        hint: "Single Next.js fullstack application",
      },
      {
        value: "frontend+backend",
        label: "Frontend + Backend",
        hint: "Separate frontend and backend workspaces",
      },
      {
        value: "frontend",
        label: "Frontend only",
        hint: "SPA / Frontend application",
      },
    ],
  });

  if (isCancel(type)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  let frontend: Answers["frontend"];
  let backend: Answers["backend"];
  let username: string | undefined;

  // 3. Frontend selection
  if (type === "fullstack") {
    frontend = "nextjs-fullstack";
  } else if (type === "frontend" || type === "frontend+backend") {
    const frontendChoice = await select({
      message: "Select frontend framework:",
      options: [
        {
          value: "nextjs-frontend",
          label: "Next.js (Frontend)",
          hint: "Next.js v16 (linked to backend)",
        },
        {
          value: "react-vite",
          label: "React + Vite",
          hint: "React with Vite, TailwindCSS, shadcn/ui",
        },
      ],
    });

    if (isCancel(frontendChoice)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }
    frontend = frontendChoice as Answers["frontend"];
  }

  // 4. Backend selection
  if (type === "backend" || type === "frontend+backend") {
    const backendChoice = await select({
      message: "Select backend framework:",
      options: [
        {
          value: "go-fiber",
          label: "Go Fiber v3",
          hint: "Go Fiber v3, GORM, PostgreSQL, JWT Auth",
        },
      ],
    });

    if (isCancel(backendChoice)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }
    backend = backendChoice as Answers["backend"];

    // 5. Username (for Go module name)
    if (backend === "go-fiber") {
      const usernameInput = await text({
        message: "GitHub / organization username (for Go module path):",
        placeholder: "vydev",
        defaultValue: "vydev",
        validate: (value) => {
          if (!value || !value.trim()) return "Username cannot be empty";
          return;
        },
      });

      if (isCancel(usernameInput)) {
        cancel("Operation cancelled.");
        process.exit(0);
      }
      username = usernameInput as string;
    }
  }

  return {
    projectName: projectName as string,
    type: type as Answers["type"],
    frontend,
    backend,
    username,
  };
}
