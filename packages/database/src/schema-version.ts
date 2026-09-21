export interface SemanticVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export function parseSemanticVersion(value: string): SemanticVersion {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value);
  if (match === null) throw new Error(`Invalid semantic version: ${value}`);
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

export function compareSemanticVersions(left: string, right: string): number {
  const a = parseSemanticVersion(left);
  const b = parseSemanticVersion(right);
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

export function isApplicationBuildCompatible(
  applicationBuild: string,
  minimumApplicationBuild: string,
  maximumApplicationBuild: string,
): boolean {
  return (
    compareSemanticVersions(applicationBuild, minimumApplicationBuild) >= 0 &&
    compareSemanticVersions(applicationBuild, maximumApplicationBuild) <= 0
  );
}
