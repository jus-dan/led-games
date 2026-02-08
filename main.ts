input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    // optional: durch RGB wechseln
    currentColor = (currentColor + 1) % 3
})
function toRgb (c: number) {
    if (c == 0) {
        return neopixel.colors(NeoPixelColors.Red)
    }
    if (c == 1) {
        return neopixel.colors(NeoPixelColors.Green)
    }
    return neopixel.colors(NeoPixelColors.Blue)
}
// Buttons: NUR Zustand ändern
input.onButtonPressed(Button.A, function () {
    // A = "leer spawnen" (black)
    currentColor = -1
})
function shiftLeft () {
    for (let k = 0; k <= lane.length - 1 - 1; k++) {
        lane[k] = lane[k + 1]
    }
    lane[lane.length - 1] = currentColor
}
input.onButtonPressed(Button.B, function () {
    // B = Rot spawnen
    currentColor = 0
})
function initLane () {
    lane = []
    for (let index = 0; index < strip.length(); index++) {
        lane.push(-1)
    }
}
function render () {
    strip.clear()
    for (let j = 0; j <= lane.length - 1; j++) {
        if (lane[j] != -1) {
            strip.setPixelColor(j, toRgb(lane[j]))
        }
    }
    strip.show()
}
let lane: number[] = []
let currentColor = 0
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P14, 90, NeoPixelMode.RGB)
initLane()
render()
basic.forever(function () {
    shiftLeft()
    render()
    basic.pause(200)
})
