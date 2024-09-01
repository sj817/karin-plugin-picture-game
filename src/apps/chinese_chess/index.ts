import { KarinAdapter, Plugin, segment } from 'node-karin'
import Game from './game'
import Canvas from './canvas'

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
          reg: /^test$/,
          fnc: 'test'
        }
      ],
    })
    Canvas.init()
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
      this.reply('当前舞台已满人，请欣赏他们的表演')
      return true
    }
    if (game.getPlayerInfo(0) === this.e.user_id) {
      this.reply('您正在后台准备表演中')
      return true
    }
    game.addPlayer(this.e.user_id)
    if (!game.getGameStatus()) {
      this.reply([segment.text('欢迎 '), segment.at(this.e.user_id), segment.text(' 加入舞台，请等待下一位加入')])
      return true
    }

    // 开始游戏
    return true
  };

  async menu () {
    this.reply('欢迎来到中国象棋')
    return true
  };

  async test () {
    const b64 = Canvas.test()
    this.reply([segment.image('base64://' + b64)])
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
