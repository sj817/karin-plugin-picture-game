import FEN from './fen'
import { index, move } from './move'

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
