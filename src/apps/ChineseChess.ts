import { KarinAdapter, KarinElement, Plugin, segment } from 'node-karin'
import Game from './chinese_chess/game'
import Canvas from './chinese_chess/canvas'

const games = new Map<string, Game>()

export default class ChineseChess extends Plugin {
  constructor () {
    super({
      name: '中国象棋',
      desc: '图片版的中国象棋',
      event: 'message.group_message',
      rule: [
        {
          reg: /^中国象棋$/,
          fnc: 'menu'
        },
        {
          reg: /^加入中国象棋$/,
          fnc: 'join'
        },
        {
          reg: /^([a-iA-I])([0-9])([a-iA-I])([0-9])$/,
          fnc: 'coordinatesMove'
        },
        {
          reg: /^test([a-iA-I])([0-9])([a-iA-I])([0-9])$/,
          fnc: 'test'
        }
      ],
    })
    Canvas.init()
  }

  async coordinatesMove () {
    const msg = this.e.msg.toUpperCase()
    const game = games.get(this.e.group_id)
    if (!game || !game.getGameStatus()) {
      return false
    }
    const y = msg.charCodeAt(0) - 'A'.charCodeAt(0)
    const x = Math.abs(msg.charCodeAt(1) - '0'.charCodeAt(0) - 9)
    const ty = msg.charCodeAt(2) - 'A'.charCodeAt(0) - y
    const tx = Math.abs(msg.charCodeAt(3) - '0'.charCodeAt(0) - 9) - x
    return true
  }

  async join () {
    const group = this.e.group_id
    let game = games.get(group)
    if (!game) {
      game = new Game()
      games.set(group, game)
      game.setLastTime(Date.now())
      this.countDown(group, this.e.bot)
    }
    if (game.getGameStatus()) {
      this.reply('当前舞台已满人，请欣赏他们的表演', { reply: true })
      return true
    }
    if (game.getPlayerInfo(0) === this.e.user_id) {
      this.reply('您正在后台准备表演中', { reply: true })
      return true
    }
    game.addPlayer(this.e.user_id)
    if (!game.getGameStatus()) {
      this.reply([segment.text('欢迎 '), segment.at(this.e.user_id), segment.text(' 加入舞台，请等待下一位加入')], { reply: true })
      return true
    }
    const msg = [
      segment.text('欢迎 '),
      segment.at(this.e.user_id),
      segment.text(' 加入舞台，舞台已就绪，请开始表演\n'),
      segment.image(Canvas.draw(game.getBoard())),
      segment.text('\n'),
      segment.at(game.getPlayerInfo(0)),
      segment.text('\n'),
      segment.at(game.getPlayerInfo(1)),
      segment.text('\n请自行决定谁先开始表演')
    ]
    await this.reply(msg)
    // 开始游戏
    return true
  };

  async menu () {
    this.reply('欢迎来到中国象棋', { reply: true })
    return true
  };

  async test () {
    const msg = this.e.msg.substring(4).toUpperCase()
    let game = games.get(this.e.group_id)
    if (!game) {
      game = new Game()
      games.set(this.e.group_id, game)
    }
    const y = msg.charCodeAt(0) - 'A'.charCodeAt(0)
    const x = Math.abs(msg.charCodeAt(1) - '0'.charCodeAt(0) - 9)
    const ty = msg.charCodeAt(2) - 'A'.charCodeAt(0) - y
    const tx = Math.abs(msg.charCodeAt(3) - '0'.charCodeAt(0) - 9) - x
    if (game.move([x, y], [tx, ty])) {
      const board = game.getBoard()
      const img = Canvas.draw(board)
      await this.reply(segment.image(img))
    } else {
      this.reply('无法做出对应舞步', { reply: true })
    }
    return true
  }

  private countDown (group: string, bot: KarinAdapter) {
    setTimeout(async () => {
      // const game = games.get(group)
      // if (game) {
      //   const time = game.getLastTime()
      //   const differ = Date.now() - time
      //   if (differ > 60000 && differ < 61000) {
      //     const contact = karin.contactGroup(group)
      //     const elements = [
      //       segment.at(qq),
      //       segment.text(' 在本次中国象棋舞台中你的表演时间剩余2分钟')
      //     ]
      //     await bot.SendMessage(contact, elements)
      //   } else if (differ > 120000 && differ < 121000) {
      //     const contact = karin.contactGroup(group)
      //     const elements = [
      //       segment.at(qq),
      //       segment.text(' 在本次中国象棋舞台中你的表演时间剩余1分钟')
      //     ]
      //     await bot.SendMessage(contact, elements)
      //   } else if (differ > 150000 && differ < 151000) {
      //     const contact = karin.contactGroup(group)
      //     const elements = [
      //       segment.at(qq),
      //       segment.text(' 在本次中国象棋舞台中你的表演时间剩余30秒')
      //     ]
      //     await bot.SendMessage(contact, elements)
      //   } else if (differ > 170000 && differ < 171000) {
      //     const contact = karin.contactGroup(group)
      //     const elements = [
      //       segment.at(qq),
      //       segment.text(' 在本次中国象棋舞台中你的表演时间剩余10秒')
      //     ]
      //     await bot.SendMessage(contact, elements)
      //   } else if (differ > 180000) {
      //     const contact = karin.contactGroup(group)
      //     const elements = [
      //       segment.at(qq),
      //       segment.text(' 由于你灵感缺失无法做出对应舞步，表演结束')
      //     ]
      //     await bot.SendMessage(contact, elements)
      //     games.delete(group)
      //     return
      //   }

      //   this.countDown(group, bot)
      // }
    }, 1000)
  }
}
