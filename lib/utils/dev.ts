function isProtectedRoute(path: string, patterns: (string | RegExp)[]) {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return path.startsWith(pattern);
    }
    return pattern.test(path);
  });
}
