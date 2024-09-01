import { dirPath } from '@/utils'
import { createCanvas, Image } from 'canvas'

export default class Canvas {
  private static readonly images = new Map<string, Image>()
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
    if (this.images.size === 0) {
      const imagePath = dirPath + '/resources/image/'
      for (const key in this.resources) {
        const img = new Image()
        img.onload = () => this.images.set(key, img)
        img.src = imagePath + this.resources[key]
      }
    }
  }

  public static draw (board: string[][]): string {
    const bit = 64
    const bg = this.images.get('bg')!
    const canvas = createCanvas(bit * 10, bit * 11)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0, bit * 10, bit * 11)
    ctx.translate(bit / 2, bit / 2)
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const char = board[i][j]
        if (char !== ' ') {
          const img = this.images.get(char)!
          ctx.drawImage(img, j * bit, i * bit, bit, bit)
        }
      }
    }
    // const img = this.images.get('r')!
    // ctx.drawImage(img, 0, 0, bit, bit)
    return 'base64://' + canvas.toBuffer().toString('base64')
  }

  public static test () {
    const image = this.images.get('r')!
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)
    // const ctx = canvas.getContext('2d')
    return canvas.toBuffer().toString('base64')
  }
}
