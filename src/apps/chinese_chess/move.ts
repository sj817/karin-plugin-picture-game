import PositionStruct from './PositionStruct'

export type index = [x:number, y:number]
export type move = [moveX: number, moveY: number]

export default class Move {
  private readonly fnc = [this.rookMove.bind(this), this.knightMove.bind(this), this.cannonMove.bind(this), this.bishopMove.bind(this), this.pawnMove.bind(this), this.advisorMove.bind(this), this.kingMove.bind(this)]
  private readonly squares
  constructor (board: string[][]) {
    const arr = PositionStruct.ucpcSquares
    const arrBoard = board.flat()
    let i = 0
    this.squares = arr.map(value => value === 1 ? arrBoard[i++] : value)
  }

  public checkMove (color: 'w' | 'b', position: index, move: move): { result: boolean, eat: boolean } {
    const index = position[0] * 16 + position[1]
    const piece = this.squares[index]
    const to = index + move[0] * 16 + move[1]
    const toPiece = this.squares[to]
    if (piece === ' ' || typeof piece === 'number') return { result: false, eat: false }
    const pieceColor = piece.toUpperCase() === piece ? 'b' : 'w'
    if (pieceColor !== color) return { result: false, eat: false }
    for (const fn of this.fnc) {
      const result = fn(index, to)
      if (result) {
        const eat = (toPiece !== ' ' && typeof toPiece !== 'number')
        if (eat) {
          // 吃子,判断是不是自家的
          const toPieceColor = toPiece.toUpperCase() === toPiece ? 'b' : 'w'
          if (toPieceColor === color) return { result: false, eat: false }
        }
        this.squares[index] = ' '
        this.squares[to] = piece
        return { result, eat }
      }
    }
    return { result: false, eat: false }
  }

  // 兵移动判断
  public pawnMove (index: number, to: number) : boolean {
    const piece = this.squares[index]
    if (piece !== 'p' && piece !== 'P') return false
    // 移动判断
    if (PositionStruct.PawnTab[to] === 0) return false
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
    // 过河的兵，检测是否后退
    return to - retreat === index
  }

  // 炮移动判断
  public cannonMove (index: number, to: number) : boolean {
    const piece = this.squares[index]
    if (piece !== 'c' && piece !== 'C') return false
    // 获取间隔棋子
    const num = this.pieceNumber(index, to)
    if (num === 0) {
      // 为0判断落点是不是棋子
      return this.squares[to] === ' '
    }
    if (num === 1) {
      // 为1判断落点有没有棋子
      return this.checkPiece(to)
    }
    return false
  }

  // 将移动判断
  public kingMove (index: number, to: number) : boolean {
    const piece = this.squares[index]
    if (piece !== 'k' && piece !== 'K') return false
    // 移动判断
    if (PositionStruct.KingArea[to] === 0) return false
    // 过河判断
    if (((index ^ to) & 0x80) === 0) return true
    // 过河了
    // 判断中间是否有棋子
    if (this.pieceNumber(index, to) !== 0) return false
    // 判断飞将
    const toPiece = this.squares[to]
    return (toPiece === 'k' || toPiece === 'K')
  }

  // 士移动判断
  public advisorMove (index: number, to: number) : boolean {
    const piece = this.squares[index]
    if (piece !== 'a' && piece !== 'A') return false
    // 移动判断
    if (PositionStruct.AdvisorArea[to] === 0) return false
    // 过河判断
    return ((index ^ to) & 0x80) === 0
  }

  // 象移动判断
  public bishopMove (index: number, to: number) {
    const piece = this.squares[index]
    if (piece !== 'b' && piece !== 'B') return false
    // 移动判断
    const leg = PositionStruct.ElephantLegTab[PositionStruct.index + to - index]
    if (leg === 0) return false
    // 象眼判断
    if (this.checkPiece(index + leg)) return false
    // 过河判断
    return ((index ^ to) & 0x80) === 0
  }

  // 马移动判断
  public knightMove (index: number, to: number) {
    const piece = this.squares[index]
    if (piece !== 'n' && piece !== 'N') return false
    to -= index
    const leg = PositionStruct.HorseLegTab[PositionStruct.index + to]
    if (leg === 0) return false
    return !this.checkPiece(index + leg)
  }

  // 车移动判断
  public rookMove (index: number, to: number) {
    const piece = this.squares[index]
    if (piece !== 'r' && piece !== 'R') return false
    const num = this.pieceNumber(index, to)
    return num === 0
  }

  // 检测该位置是否有棋子
  public checkPiece (index: number) {
    const piece = this.squares[index]
    return piece !== 0 && piece !== ' '
  }

  // 检测到该位置中间有几个棋子
  private pieceNumber (index: number, to: number) : number {
    // 是否是直线移动
    to -= index
    const move = [Math.trunc(to / 16), to % 16]
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
