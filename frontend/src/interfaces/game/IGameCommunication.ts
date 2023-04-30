
// What the client send when he moves its paddle
export interface IPlayerMove {
  y: number
}

// What the server send when the point is finished
export interface IPointWon {
    score1: number
    score2: number
}

// What the server send when the game is over
export interface IGameoverData {
    winnerId: number
    score1: number
    score2: number
}

// What the server send on every sync
export interface IWorldState {
  ball: {
    x: number
    y: number
    vx: number
    vy: number
  }
  paddle1: {
    x: number
    y: number
  }
  paddle2: {
    x: number
    y: number
  }
  obstacles: {
    x: number
    y: number
  }[]
}
