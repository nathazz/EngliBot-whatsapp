export function parseBoxArgs(input: string) {
  const regex = /"([^"]+)"|(\S+)/g;
  const args: string[] = [];

  let match;

  while ((match = regex.exec(input))) {
    args.push(match[1] ?? match[2]);
  }

  return args;
}
