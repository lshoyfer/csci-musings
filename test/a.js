function Poredak(n, correctStrs, answerStrs) {
  const correctMap = new Map((function*() {
    for (const [key, val] of Object.entries(correctStrs)) {
      yield [val, key];
    }
  })());
  const answerVals = answerStrs.map(v => correctMap.get(v));
  
  let comperand = null;
  const Y = f => (g => g(g))(g => f(x => g(g)(x)));

  const lowerGen = f => i => i < n 
    ? comperand < answerVals[i]
      ? 1 + f(i+1)
      : f(i+1)
    : 0;
  const lower = Y(lowerGen);

  const upperGen = f => i => i < n
    ? ((comperand = answerVals[i]), lower(i+1) + f(i+1))
    : 0;
  const upper = Y(upperGen);

  return `${upper(0)}/${n*((n-1)/2)}`;
}

console.log(
  Poredak(
    n=3,
    correctStrs=['yo','pee','poop'],
    answerStrs=['pee', 'poop', 'yo']
  )
);

console.log(
  Poredak(
    n=3,
    correctStrs=['alpha','beta','gamma'],
    answerStrs=['alpha', 'gamma', 'beta']
  )
);

console.log(
  Poredak(
    n=5,
    correctStrs=['naboo','geonosis','yavin', 'hoth', 'endor'],
    answerStrs=['geonosis', 'yavin', 'hoth', 'endor', 'naboo']
  )
);

