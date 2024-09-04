import FEN from './fen'
import { index, move } from './move'

type rod = { retract: boolean, sue: boolean }

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
  private sue = false
  // 是否处理过悔棋或求和

  private rod: rod = { retract: false, sue: false }
  // 记录红方
  private red?: string

  constructor (fen: string = this.initialFEN) {
    this.fen = new FEN(fen)
    this.history.push(fen)
  }

  public regret () {
    const oldFen = this.history.pop()!
    this.retract = false
    this.retract = false
    this.sue = false
    this.clearRod()
    this.nextPlayer()
    this.lastTime = Date.now()
    this.fen = new FEN(oldFen)
  }

  public move (qq: string, position: index, move: move): boolean {
    position[0] += 3
    position[1] += 3
    if (this.fen.checkMove(this.red === qq ? 'w' : 'b', position, move)) {
      this.history.push(this.fen.toString())
      this.retract = false
      this.retract = false
      this.sue = false
      this.clearRod()
      this.nextPlayer()
      this.lastTime = Date.now()
      return true
    } else {
      return false
    }
  }

  public getRod (key: keyof rod): boolean {
    return this.rod[key]
  }

  public setRod (key: keyof rod) {
    this.rod[key] = true
  }

  private clearRod () {
    this.rod = { retract: false, sue: false }
  }

  public getSue (): boolean {
    return this.sue
  }

  public setSue (): void {
    this.sue = true
  }

  public getRetract (): boolean {
    return this.retract
  }

  public setRetract (): void {
    this.retract = true
  }

  public setRed (qq: string) {
    if (this.red !== undefined) return
    this.red = qq
    this.player = this.playerInfo[0] === qq ? 1 : 0
  }

  public getHistoryLength () {
    return this.history.length
  }

  public checkPlayer (qq: string) {
    return this.playerInfo.includes(qq)
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
