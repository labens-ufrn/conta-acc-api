import { execSync } from "child_process";
import { existsSync, readFileSync, rmSync } from "fs";
import { join } from "path";

export async function build() {
  const schemaPath = join(__dirname, "..", "routes.json");
  const keyPath = join(__dirname, "..", "last-checksum.txt");

  if (!existsSync(join(__dirname, "node_modules", "ts-node"))) {
    console.log("Installing dependencies...");
    execSync("yarn", { cwd: __dirname });
  }

  console.log("Building SDK...");

  rmSync(join(__dirname, "dist"), { recursive: true, force: true });
  rmSync(join(__dirname, "generated"), { recursive: true, force: true });

  const keyString = readFileSync(keyPath).toString();

  const command = `npx pomme -f ${schemaPath} -k ${keyString}`;

  execSync(command, { cwd: __dirname });
  execSync("npx tsc", { cwd: __dirname });

  rmSync(join(__dirname, "generated"), { recursive: true, force: true });
}

const args = process.argv.slice(2);

if (args.includes("--build")) {
  build();
}
