import { Plugin } from 'node-karin'

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
      ]
    })
  }

  async menu () {
    this.reply('欢迎来到中国象棋')
    return true
  };
}
