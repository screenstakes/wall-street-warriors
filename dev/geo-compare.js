// node dev/geo-compare.js old.json new.json [tolerancePx]
// Prints elements that moved/resized beyond the tolerance, and text that exists only in one version.
const fs = require("fs");
const [a, b, tolArg] = process.argv.slice(2);
const tol = Number(tolArg || 1);
const A = JSON.parse(fs.readFileSync(a, "utf8")), B = JSON.parse(fs.readFileSync(b, "utf8"));
const moved = [], onlyA = [], onlyB = [];
for (const k of Object.keys(A)) {
  if (!(k in B)) { onlyA.push(k); continue; }
  const d = A[k].map((v, i) => Math.abs(v - B[k][i]));
  if (Math.max(...d) > tol) moved.push(`${k.slice(0, 70)}  old=${A[k]} new=${B[k]}`);
}
for (const k of Object.keys(B)) if (!(k in A)) onlyB.push(k);
const ok = moved.length === 0 && onlyA.length === 0 && onlyB.length === 0;
console.log(`${ok ? "IDENTICAL" : "DIFF"}  elements=${Object.keys(A).length}/${Object.keys(B).length}  moved=${moved.length}  onlyOld=${onlyA.length}  onlyNew=${onlyB.length}`);
const show = (t, arr) => { if (arr.length) { console.log(`-- ${t}`); arr.slice(0, 12).forEach(x => console.log("   " + x.slice(0, 110))); } };
show("moved", moved); show("only in old", onlyA); show("only in new", onlyB);
