/**
 * === BEATBOX BOOMBOX (micro:bit V2 + NeoPixel) ===
 * 
 * 30 LEDs an P14, 1 Stripe als liegende 8 um zwei Speaker
 * 
 * Shake = Mode wechseln
 * 
 * Mic = steuert Speed/Farbe (staccato)
 * 
 * Bass-Flash (weiß) NUR in Mode SPARKLE_BEATBOX (Mode 3)
 */
/**
 * Flash nur in Mode 3
 */
function clamp (v: number, lo: number, hi: number) {
    if (v < lo) {
        return lo
    }
    if (v > hi) {
        return hi
    }
    return v
}
function map01 (v: number, inMin: number, inMax: number) {
    v = clamp(v, inMin, inMax)
    return (v - inMin) / (inMax - inMin)
}
function drawPulse (levelQ: number, beat: boolean) {
    // Staccato Pulse: 2 Farben, Beat toggelt hart
    baseL = neopixel.hsl((hueBase + 10) % 360, 99, 55)
    baseR = neopixel.hsl((hueBase + 190) % 360, 99, 55)
    c = 0.25 + 0.75 * levelQ
    // harter Schlag
    if (beat) {
        c = 1
    }
    for (let k = 0; k <= LEFT_LEN - 1; k++) {
        setLeft(k, dim(baseL, c))
    }
    for (let l = 0; l <= RIGHT_LEN - 1; l++) {
        setRight(l, dim(baseR, c))
    }
}
function setRight (i: number, c: number) {
    strip.setPixelColor(LEFT_LEN + i, c)
}
function drawDualChase (levelQ: number) {
    strip.clear()
    // härterer Kontrast statt weichem Glow
    // Hintergrund dunkel
    bg = dim(neopixel.hsl((hueBase + 0) % 360, 99, 25), 0.15)
    for (let i = 0; i <= LEFT_LEN - 1; i++) {
        setLeft(i, bg)
    }
    for (let j = 0; j <= RIGHT_LEN - 1; j++) {
        setRight(j, bg)
    }
    // kurze, harte Tail-Länge
    tail = 4
    brightness = 0.35 + 0.75 * levelQ
    // Links vorwärts
    for (let t = 0; t <= tail - 1; t++) {
        idx = (posL - t + LEFT_LEN) % LEFT_LEN
        f = brightness * (1 - t / tail)
        col = neopixel.hsl((hueBase + 30) % 360, 99, 55)
        setLeft(idx, dim(col, f))
    }
    // Rechts rückwärts
    for (let u = 0; u <= tail - 1; u++) {
        idx2 = (posR + u) % RIGHT_LEN
        h = brightness * (1 - u / tail)
        col2 = neopixel.hsl((hueBase + 210) % 360, 99, 55)
        setRight(idx2, dim(col2, h))
    }
}
input.onGesture(Gesture.Shake, function () {
    mode = (mode + 1) % 3
    strip.showColor(neopixel.colors(NeoPixelColors.Blue))
    basic.pause(40)
    strip.clear()
    strip.show()
})
function setLeft (i: number, c: number) {
    strip.setPixelColor(i, c)
}
function drawSparkleBeatbox (levelQ: number, beat: boolean) {
    // Dunkle Basis + schnelle Sparkles
    strip.clear()
    base = neopixel.hsl(hueBase % 360, 99, 25)
    for (let m = 0; m <= LED_COUNT - 1; m++) {
        strip.setPixelColor(m, dim(base, 0.12 + 0.18 * levelQ))
    }
    // viele kurze Sparkles
    n = 3 + Math.round(levelQ * 10)
    for (let index = 0; index < n; index++) {
        p = randint(0, LED_COUNT - 1)
        col3 = neopixel.hsl((hueBase + randint(0, 160)) % 360, 99, 60)
        strip.setPixelColor(p, dim(col3, 0.75))
    }
    // Beat startet Flash-Timer (nur Mode 3)
    if (beat) {
        flashMs = FLASH_DURATION
    }
}
function dim (c: number, f01: number) {
    let r = (c >> 16) & 0xFF
let g = (c >> 8) & 0xFF
let b = c & 0xFF
factor = f01 * MASTER_BRIGHTNESS
    r = Math.min(255, Math.round(r * factor))
    g = Math.min(255, Math.round(g * factor))
    b = Math.min(255, Math.round(b * factor))
    return neopixel.rgb(r, g, b)
}
function applyFlashOverlay () {
    if (flashMs <= 0) {
        return
    }
    // knackiges Weiß
    strip.showColor(neopixel.rgb(255, 255, 255))
    flashMs = Math.max(0, flashMs - LOOP_MS)
}
// Quantize 0..1 auf Stufen => weniger smooth, mehr "beatbox"
function quantize01 (x: number) {
    // 5 Stufen: 0, .25, .5, .75, 1
    if (x < 0.15) {
        return 0
    }
    if (x < 0.35) {
        return 0.25
    }
    if (x < 0.6) {
        return 0.5
    }
    if (x < 0.85) {
        return 0.75
    }
    return 1
}
let beat = false
let peakCooldown = 0
let lastSmooth = 0
let rise = 0
let step = 0
let levelQ = 0
let level01 = 0
let smooth = 0
let raw = 0
let factor = 0
let flashMs = 0
let col3 = 0
let p = 0
let n = 0
let base = 0
let col2 = 0
let h = 0
let posR = 0
let idx2 = 0
let col = 0
let f = 0
let posL = 0
let idx = 0
let brightness = 0
let tail = 0
let bg = 0
let c = 0
let baseR = 0
let hueBase = 0
let baseL = 0
let v = 0
let FLASH_DURATION = 0
let LOOP_MS = 0
let MASTER_BRIGHTNESS = 0
let RIGHT_LEN = 0
let LEFT_LEN = 0
let strip: neopixel.Strip = null
let LED_COUNT = 0
LED_COUNT = 30
strip = neopixel.create(DigitalPin.P14, LED_COUNT, NeoPixelMode.RGB)
strip.clear()
strip.show()
// >>> Anpassen falls nötig:
LEFT_LEN = 15
RIGHT_LEN = LED_COUNT - LEFT_LEN
// Helligkeit
MASTER_BRIGHTNESS = 2
enum Mode { DUAL_CHASE = 0, PULSE = 1, SPARKLE_BEATBOX = 2 }
let mode = Mode.DUAL_CHASE
// Mic Tuning (etwas weniger sensibel)
let floor = 28
let ceiling = 190
// Beat Tuning (abschwächen)
// war 10 -> weniger sensitiv
let RISE_TH = 16
// war 0.18 -> braucht mehr Pegel
let LEVEL_TH = 0.28
// war 5 -> weniger oft blitzen
let COOLDOWN_TICKS = 8
// Timing
LOOP_MS = 12
// kurz und knackig
FLASH_DURATION = 90
basic.forever(function () {
    // Mic: weniger smooth, schneller reagieren (und danach quantisieren)
    raw = input.soundLevel()
    smooth = Math.round(smooth * 0.45 + raw * 0.55)
    level01 = map01(smooth, floor, ceiling)
    levelQ = quantize01(level01)
    // Position update: schneller, "beatboxy"
    // 1..4
    step = 1 + Math.round(levelQ * 3)
    posL = (posL + step) % LEFT_LEN
    posR = (posR - step + RIGHT_LEN) % RIGHT_LEN
    // Farbwechsel schneller (weniger smooth)
    hueBase = (hueBase + 8 + Math.round(levelQ * 14)) % 360
    // Beat detection (abgeschwächt)
    rise = smooth - lastSmooth
    lastSmooth = smooth
    if (peakCooldown > 0) {
        peakCooldown += -1
    }
    if (rise > RISE_TH && levelQ >= 0.25 && level01 > LEVEL_TH && peakCooldown == 0) {
        beat = true
        peakCooldown = COOLDOWN_TICKS
    }
    // Zeichnen
    if (mode == Mode.DUAL_CHASE) {
        drawDualChase(levelQ)
        strip.show()
    } else if (mode == Mode.PULSE) {
        drawPulse(levelQ, beat)
        strip.show()
    } else {
        drawSparkleBeatbox(levelQ, beat)
        strip.show()
        // Flash overlay nur in Mode 3
        applyFlashOverlay()
    }
    basic.pause(LOOP_MS)
})
