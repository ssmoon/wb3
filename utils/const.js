export function getWordBookCNName(wordBookType) {
  switch (wordBookType) {
    case 1: return '英语六级';
    case 16: return '托福';
    case 12: return 'GRE';
    case 6: return '雅思';
    case 13: return '英语四级';
  }
}

export function getPhaseCNName(wordBookStatus) {
  switch (wordBookStatus) {
    case 11: return '强化记忆阶段';
    case 21: return '查漏补缺阶段';
  }
}
