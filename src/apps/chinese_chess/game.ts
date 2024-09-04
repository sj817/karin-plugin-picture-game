import Move, { index, move } from './move'

class FEN {
  readonly chess: { [key: string]: string }
  readonly move: Move

  private board: string[][]
  private color: 'w' | 'b' = 'b'
  private history: string[] = []
  private moveSum: number = 0
  private roundSum: number = 0

  constructor (FEN: string) {
    this.chess = {
      r: '车',
      n: '马',
      b: '象',
      a: '士',
      k: '将',
      p: '兵',
      c: '炮',
      R: '車',
      N: '馬',
      B: '象',
      A: '士',
      K: '帅',
      P: '卒',
      C: '砲'
    }
    const fenArr = FEN.split(' ')
    this.color = fenArr[1] === 'b' ? 'b' : 'w'
    this.moveSum = fenArr[4].match(/\d+/) ? parseInt(fenArr[4]) : 0
    this.roundSum = fenArr[5].match(/\d+/) ? parseInt(fenArr[5]) : 0
    this.board = fenArr[0].split('/').map((row) => {
      const rowArr: string[] = []
      for (let i = 0; i < row.length; i++) {
        const char = row[i]
        if (char >= '1' && char <= '9') {
          // 数字字符表示空位数
          const emptySpaces = parseInt(char, 10)
          for (let j = 0; j < emptySpaces; j++) {
            // 用空格表示空位
            rowArr.push(' ')
          }
        } else {
          // 非数字字符表示棋子
          rowArr.push(char)
        }
      }
      return rowArr
    })
    this.move = new Move(this.board)
  }

  public checkMove (position: index, move: move) {
    const res = this.move.checkMove(position, move)
    if (res) {
      this.board = this.move.getBoard()
      return true
    } else {
      return false
    }
  }

  public getBoard () {
    return this.board
  }

  public toString () {
    const boardStr = this.board.map((row) => {
      let vacant = 0
      for (let i = 0; i < row.length; i++) {
        const piece = row[i]
        if (piece === ' ') {
          vacant++
        } else {
          if (vacant > 0) {
            row[i - vacant] = vacant.toString()
            vacant = 0
          }
        }
      }
      if (vacant > 0) {
        row[row.length - vacant] = vacant.toString()
      }
      return row.filter((value) => value !== ' ').join('')
    }).join('/')
    return `${boardStr} ${this.color} - - ${this.moveSum} ${this.roundSum}`
  }
}

export default class Game {
  // https://www.xqbase.com/protocol/cchess_fen.htm
  readonly initialFEN: string = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 0'
  // 记录历史棋局 FEN 字符串数组
  private history: string[] = []
  private fen: FEN
  // 上次有效操作时间
  private lastTime: number = 0
  // 开始游戏前记录玩家数量，开始后记录当前玩家
  private player: number = 0
  // 玩家QQ号
  private playerInfo: string[] = []
  // 游戏状态
  private game = false
  // 悔棋
  private retract = false
  // 求和
  private draw = false
  // 对手是否申请过悔棋或者和棋
  private rod = false

  constructor (fen: string = this.initialFEN) {
    this.fen = new FEN(fen)
    this.history.push(fen)
  }

  public move (position: index, move: move): boolean {
    position[0] += 3
    position[1] += 3
    return this.fen.checkMove(position, move)
  }

  public getBoard () {
    return this.fen.getBoard()
  }

  public setLastTime (time: number) {
    this.lastTime = time
  }

  public getLastTime () {
    return this.lastTime
  }

  public getFEN () {
    return this.fen
  }

  public nextPlayer () {
    this.player = this.player === 0 ? 1 : 0
  }

  public getPlayer () {
    return this.player
  }

  public getPlayerInfo (player: number = -1) {
    return this.playerInfo[player === -1 ? this.player : player]
  }

  public addPlayer (qq: string) {
    if (this.game) return
    this.setLastTime(Date.now())
    this.playerInfo.push(qq)
    this.nextPlayer()
    if (this.player === 0) {
      this.game = true
    }
  }

  public getGameStatus () {
    return this.game
  }
}
