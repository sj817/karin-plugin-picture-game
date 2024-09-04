import { dirPath } from '@/utils'
import { createCanvas, Image } from 'canvas'
const images = new Map<string, Image>()

export default class Canvas {
  // 小写黑方，大写红方
  private static readonly resources: { [key: string]: string } = {
    bg: 'bg.png',
    r: 'b_r.png',
    n: 'b_n.png',
    b: 'b_b.png',
    a: 'b_a.png',
    k: 'b_k.png',
    p: 'b_p.png',
    c: 'b_c.png',
    b_box: 'b_box.png',
    R: 'r_r.png',
    N: 'r_n.png',
    B: 'r_b.png',
    A: 'r_a.png',
    K: 'r_k.png',
    P: 'r_p.png',
    C: 'r_c.png',
    r_box: 'r_box.png',
  }

  public static init () {
    if (images.size === 0) {
      const imagePath = dirPath + '/resources/image/chinese_chess/'
      for (const key in this.resources) {
        const img = new Image()
        img.onload = () => images.set(key, img)
        img.src = imagePath + this.resources[key]
      }
    }
  }

  public static draw (board: string[][]): string {
    const bit = 64
    const bg = images.get('bg')!
    const canvas = createCanvas(bit * 10, bit * 12)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0, bit * 10, bit * 12)
    // 画入通用坐标
    // const str = 'ABCDEFGHIJ'
    ctx.font = '30px sans-serif'
    ctx.fillStyle = '#1e9eb3'
    for (let i = 0; i < board.length; i++) {
      const str = String(i)
      const sy = bit * (11 - i) - 10
      ctx.fillText(str, bit / 4, sy)
      ctx.fillText(str, canvas.width - bit / 2, sy)
    }
    let str = ' ABCDEFGHIJ'
    for (let i = 1; i <= board[0].length; i++) {
      const text = str[i]
      const sx = bit * i - 10
      ctx.fillText(text, sx, bit)
      ctx.fillText(text, sx, canvas.height - bit / 2)
    }
    // 画入专业术语坐标
    ctx.fillStyle = '#f1441d'
    str = ' 九八七六五四三二一'
    for (let i = 1; i <= board[0].length; i++) {
      ctx.fillText(String(i), bit * i - 10, bit / 2)
      ctx.fillText(str[i], bit * i - 15, canvas.height - 5)
    }
    // 移动初始位置
    ctx.translate(bit / 2, bit)
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const char = board[i][j]
        if (char !== ' ') {
          const img = images.get(char)!
          ctx.drawImage(img, j * bit, i * bit, bit, bit)
        }
      }
    }
    // const img = this.images.get('r')!
    // ctx.drawImage(img, 0, 0, bit, bit)
    return 'base64://' + canvas.toBuffer().toString('base64')
  }
}
