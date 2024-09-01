import { dirPath } from '@/utils'
import { createCanvas, Image } from 'canvas'

export default class Canvas {
  private static readonly images = new Map<string, Image>()
  // 小写黑方，大写红方
  private static readonly resources: { [key: string]: string } = {
    r: 'b_r.png',
    n: 'b_n.png',
    b: 'b_b.png',
    a: 'b_a.png',
    k: 'b_k.png',
    p: 'b_p.png',
    c: 'b_c.png',
    R: 'r_r.png',
    N: 'r_n.png',
    B: 'r_b.png',
    A: 'r_a.png',
    K: 'r_k.png',
    P: 'r_p.png',
    C: 'r_c.png'
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

  public static test () {
    const image = this.images.get('r')!
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)
    // const ctx = canvas.getContext('2d')
    return canvas.toBuffer().toString('base64')
  }
}
