export async function auditBuildIntegrity(repo: string) {
  // Normalize owner/repo
  let ownerRepo = repo.trim();
  if (ownerRepo.startsWith("https://github.com/")) {
    ownerRepo = ownerRepo.replace("https://github.com/", "");
    ownerRepo = ownerRepo.replace(/\.git\/?$/, "");
  }
  if (ownerRepo.split("/").length !== 2) {
    return { ok: false, error: "Provide repo as owner/repo or https://github.com/owner/repo" };
  }

  const base = `https://raw.githubusercontent.com/${ownerRepo}/HEAD`;
  const checks: { name: string; passed: boolean; note: string }[] = [];

  const fetchText = async (path: string) => {
    const res = await fetch(`${base}/${path}`, { method: "GET" });
    return res.ok ? await res.text() : null;
  };

  const lockfiles = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"];
  let lockfilePresent = false;
  for (const lf of lockfiles) {
    const text = await fetchText(lf);
    if (text) {
      lockfilePresent = true;
      break;
    }
  }
  checks.push({
    name: "JavaScript lockfile",
    passed: lockfilePresent,
    note: lockfilePresent ? "At least one lockfile found." : "No lockfile found — dependencies are not pinned.",
  });

  const cargoLock = await fetchText("Cargo.lock");
  checks.push({
    name: "Cargo.lock",
    passed: cargoLock !== null,
    note: cargoLock ? "Rust lockfile present." : "No Cargo.lock (skip if not a Rust program).",
  });

  const packageJson = await fetchText("package.json");
  if (packageJson) {
    const hasAuditScript = packageJson.includes("audit");
    checks.push({
      name: "package.json audit script",
      passed: hasAuditScript,
      note: hasAuditScript ? "audit script present." : "Consider adding `npm audit` to CI.",
    });
  }

  const ciPath = ".github/workflows";
  const workflowIndex = await fetchText(`.github/workflows/ci.yml`) || await fetchText(`.github/workflows/build.yml`);
  checks.push({
    name: "CI workflow",
    passed: workflowIndex !== null,
    note: workflowIndex ? "CI workflow found." : "No CI workflow found — add one from the skill's ci-policy-template.yml.",
  });

  const dockerfile = await fetchText("Dockerfile");
  if (dockerfile) {
    const pinned = dockerfile.match(/FROM\s+[^\s]+@sha256:/);
    checks.push({
      name: "Dockerfile base image pinned",
      passed: !!pinned,
      note: pinned ? "Base image pinned by digest." : "Pin base image with sha256 digest.",
    });
  }

  const passed = checks.filter((c) => c.passed).length;
  return {
    ok: true,
    repo: ownerRepo,
    score: `${passed}/${checks.length}`,
    checks,
  };
}
