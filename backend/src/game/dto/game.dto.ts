import { IsNumber, IsPositive } from 'class-validator'

// What the client send when he moves its paddle
export class PlayerMoveDto {
  @IsNumber()
  y: number
}

// What the server send when the point is finished
export class PointWonDto {
    @IsPositive()
    score1: number
    @IsPositive()
    score2: number
}

/**
* @brief What the server send on every sync
*/
export class WorldStateDto {
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
