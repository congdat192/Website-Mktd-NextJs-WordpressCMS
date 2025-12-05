import { mkdir, rm, access, cp } from 'node:fs/promises';
import { join } from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { AIType } from '../types/index.js';
import { AI_FOLDERS } from '../types/index.js';

const execAsync = promisify(exec);

export async function extractZip(zipPath: string, destDir: string): Promise<void> {
  try {
    await execAsync(`unzip -o "${zipPath}" -d "${destDir}"`);
  } catch (error) {
    throw new Error(`Failed to extract zip: ${error}`);
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function copyFolders(
  sourceDir: string,
  targetDir: string,
  aiType: AIType
): Promise<string[]> {
  const copiedFolders: string[] = [];

  const foldersToCopy = aiType === 'all'
    ? ['.claude', '.cursor', '.windsurf', '.agent', '.shared']
    : AI_FOLDERS[aiType];

  // Deduplicate folders (e.g., .shared might be listed multiple times)
  const uniqueFolders = [...new Set(foldersToCopy)];

  for (const folder of uniqueFolders) {
    const sourcePath = join(sourceDir, folder);
    const targetPath = join(targetDir, folder);

    // Check if source folder exists
    const sourceExists = await exists(sourcePath);
    if (!sourceExists) {
      continue;
    }

    // Create target directory if needed
    await mkdir(targetPath, { recursive: true });

    // Copy recursively
    try {
      await cp(sourcePath, targetPath, { recursive: true });
      copiedFolders.push(folder);
    } catch {
      // Try shell fallback for older Node versions
      try {
        await execAsync(`cp -r "${sourcePath}/." "${targetPath}"`);
        copiedFolders.push(folder);
      } catch {
        // Skip if copy fails
      }
    }
  }

  return copiedFolders;
}

export async function cleanup(tempDir: string): Promise<void> {
  try {
    await rm(tempDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}
