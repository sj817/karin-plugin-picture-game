import PositionStruct from './PositionStruct'

export type index = [x:number, y:number]
export type move = [moveX: number, moveY: number]

export default class Move {
  private readonly fnc = [this.rookMove, this.knightMove, this.cannonMove, this.bishopMove, this.pawnMove, this.advisorMove, this.kingMove]
  private readonly squares
  constructor (board: string[][]) {
    const arr = PositionStruct.ucpcSquares
    const arrBoard = board.flat()
    let i = 0
    this.squares = arr.map(value => value === 1 ? arrBoard[i++] : value)
  }

  public checkMove (position: index, move: move) {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    const to = index + move[0] * 16 + move[1]
    if (piece === ' ' || typeof piece === 'number') return false
    for (const fn of this.fnc) {
      const result = fn(position, move)
      if (result) {
        const eat = this.checkPiece(to)
        this.squares[index] = ' '
        this.squares[to] = piece
        return { result, eat }
      }
    }
    return { result: false, eat: false }
  }

  // 兵移动判断
  public pawnMove (position: index, move: move) : boolean {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    if (piece !== 'p' && piece !== 'P') return false
    const to = index + move[0] * 16 + move[1]
    // 获取过河判定位
    let river, retreat
    if (piece === 'p') {
      river = 0x70
      retreat = -0x10
    } else {
      river = 0x80
      retreat = 0x10
    }
    // 过河检测
    if (((index ^ river) & 0x80) === 0) {
      // 没过河的兵，检测是否向前
      return to + retreat === index
    }
    // 移动判断
    if (PositionStruct.PawnTab[to] === 0) return false
    // 过河的兵，检测是否后退
    return to - retreat === index
  }

  // 炮移动判断
  public cannonMove (position: index, move: move) : boolean {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    if (piece !== 'c' && piece !== 'C') return false
    // 获取间隔棋子
    const num = this.pieceNumber(index, move)
    const to = index + move[0] * 16 + move[1]
    if (num === 0) {
      // 为0判断落点是不是棋子
      return this.squares[to] === ' '
    }
    if (num === 1) {
      // 为1判断落点是不是棋子
      return this.checkPiece(to)
    }
    return false
  }

  // 将移动判断
  public kingMove (position: index, move: move) : boolean {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    if (piece !== 'k' && piece !== 'K') return false
    const to = index + move[0] * 16 + move[1]
    // 移动判断
    if (PositionStruct.KingArea[to] === 0) return false
    // 过河判断
    if (((index ^ to) & 0x80) === 0) return true
    // 过河了，判断飞将
    const toPiece = this.squares[to]
    return (toPiece === 'k' || toPiece !== 'K')
  }

  // 士移动判断
  public advisorMove (position: index, move: move) : boolean {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    if (piece !== 'a' && piece !== 'A') return false
    const to = index + move[0] * 16 + move[1]
    // 移动判断
    if (PositionStruct.AdvisorArea[to] === 0) return false
    // 过河判断
    return ((index ^ to) & 0x80) === 0
  }

  // 象移动判断
  public bishopMove (position: index, move: move) {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    if (piece !== 'b' && piece !== 'B') return false
    let to = move[0] * 16 + move[1]
    // 移动判断
    if (PositionStruct.ElephantLegTab[PositionStruct.index + to] === 0) return false
    to = index + to
    // 象眼判断
    if (this.checkPiece(to)) return false
    // 过河判断
    return ((index ^ to) & 0x80) === 0
  }

  // 马移动判断
  public knightMove (position: index, move: move) {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    if (piece !== 'n' && piece !== 'N') return false
    const to = move[0] * 16 + move[1]
    const leg = PositionStruct.HorseLegTab[PositionStruct.index + to]
    if (leg === 0) return false
    return this.checkPiece(index + leg)
  }

  // 车移动判断
  public rookMove (position: index, move: move) {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    if (piece !== 'r' && piece !== 'R') return false
    const num = this.pieceNumber(index, move)
    return num === 0
  }

  // 检测该位置是否有棋子
  public checkPiece (index: number) {
    const piece = this.squares[index]
    return piece !== 0 && piece !== ' '
  }

  // 检测到该位置中间有几个棋子
  private pieceNumber (index: number, move: move) : number {
    if (move[0] === 0 && move[1] === 0) return -1
    // 因为只用来检测直线，所以move中必有一个为0
    if (move[0] === 0) {
      const to = index + move[1]
      return move[1] > 0 ? this.moveX(index, to) : this.moveX(to, index)
    } else if (move[1] === 0) {
      const to = index + move[0] * 16
      return move[0] > 0 ? this.moveY(index, to) : this.moveY(to, index)
    }
    return -1
  }

  private moveY (min: number, max: number): number {
    let num = 0
    for (let i = min + 16; i < max; i += 16) {
      if (this.squares[i] !== 0 && this.squares[i] !== ' ') num++
    }
    return num
  }

  private moveX (min: number, max: number): number {
    let num = 0
    for (let i = min + 1; i < max; i++) {
      if (this.squares[i] !== 0 && this.squares[i] !== ' ') num++
    }
    return num
  }

  public getBoard () {
    const arr = this.squares.filter(value => typeof value === 'string')
    return Array.from({ length: arr.length / 9 }, (_, i) =>
      arr.slice(i * 9, i * 9 + 9)
    )
  }
}
