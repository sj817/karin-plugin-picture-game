import Move, { index, move } from './move'

export default class FEN {
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
