function calculateScore(team1Points, team2Points) {
    if (team1Points > team2Points) return 'Team 1 wins';
    if (team2Points > team1Points) return 'Team 2 wins';
    return 'Draw';
  }
  
  module.exports = { calculateScore };
  