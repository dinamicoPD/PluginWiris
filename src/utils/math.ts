// utils/math.ts

import nerdamer from 'nerdamer';
import 'nerdamer/Calculus';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
import 'nerdamer/Extra';

export function areMathExpressionsEquivalent(expr1: string, expr2: string): boolean {
  try {
    const simp1 = nerdamer(expr1).expand().toString();
    const simp2 = nerdamer(expr2).expand().toString();
    return nerdamer(`(${simp1})-(${simp2})`).expand().toString() === '0';
  } catch {
    return false;
  }
}

export function getRandomQuestions<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
