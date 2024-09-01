import { createCanvas } from 'canvas'

export default class Canvas {
  public static test () {
    const canvas = createCanvas(200, 200)
    // const ctx = canvas.getContext('2d')
    return canvas.toBuffer().toString('base64')
  }
}
