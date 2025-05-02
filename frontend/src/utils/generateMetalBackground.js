export function generateMetalTexture(level = 'Beginner', width = 1000, height = 600) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
  
    // 不同等級的金屬漸層色系
    const gradients = {
      Beginner: ['#e0e0e0', '#a6a6a6', '#c0c0c0'],       // 鈦銀
      Intermediate: ['#f9d976', '#d4af37', '#b28d00'],   // 香檳金
      Advanced: ['#f0f0f0', '#dcdcdc', '#bfbfbf'],       // 鉑金
      Elite: ['#2b2b2b', '#1c1c1c', '#000000']           // 電鍍黑
    }
  
    const colors = gradients[level] || gradients.Beginner
  
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(0.5, colors[1])
    gradient.addColorStop(1, colors[2])
  
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  
    // 模擬金屬紋理（細橫線）
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    for (let y = 0; y < height; y += 2) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  
    return canvas.toDataURL('image/png') // 返回 base64 圖片
  }
  