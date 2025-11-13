function round(n) {
  return Math.round(n * 100) / 100;
}

function f(n) {
  if (!n) return n;
  if (n < 1_000) return n.toFixed(2);
  if (n < 1_000_000) {
    const fixed = Math.round(n).toString();
    const b = fixed.slice(fixed.length - 3);
    const a = fixed.slice(0, fixed.length - 3);
    return [a, b].join(",");
  }
  if (n < 1_000_000_000) {
    const fixed = Math.round(n).toString();
    const c = fixed.slice(fixed.length - 3);
    const b = fixed.slice(fixed.length - 6, fixed.length - 3);
    const a = fixed.slice(0, fixed.length - 6);
    return [a, b, c].join(",");
  }
  return n.toExponential(3);
}

function toggleColourScheme() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
  } else {
    document.body.classList.add("dark");
  }
}
