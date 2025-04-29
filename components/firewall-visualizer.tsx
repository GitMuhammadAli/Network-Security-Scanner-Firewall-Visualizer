"use client"

import { useRef, useEffect } from "react"

type FirewallRule = {
  id: string
  action: "allow" | "deny"
  sourceIp: string
  destinationIp: string
  port: string
  protocol: "tcp" | "udp" | "icmp" | "any"
  priority: number
}

type TestTraffic = {
  sourceIp: string
  destinationIp: string
  port: string
  protocol: "tcp" | "udp" | "icmp" | "any"
  result: "allowed" | "blocked"
}

type FirewallVisualizerProps = {
  rules: FirewallRule[]
  testTraffic: TestTraffic | null
}

export default function FirewallVisualizer({ rules, testTraffic }: FirewallVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#f8fafc" // Light gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw network elements
    drawNetworkDiagram(ctx, canvas.width, canvas.height, rules, testTraffic)
  }, [rules, testTraffic])

  const drawNetworkDiagram = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    rules: FirewallRule[],
    testTraffic: TestTraffic | null,
  ) => {
    // Define positions
    const sourceX = 80
    const firewallX = width / 2
    const destinationX = width - 80
    const centerY = height / 2

    // Draw source (client)
    drawComputer(ctx, sourceX, centerY - 80, "#3b82f6", "Client")

    // Draw firewall
    drawFirewall(ctx, firewallX, centerY, rules)

    // Draw destination (server)
    drawComputer(ctx, destinationX, centerY - 80, "#10b981", "Server")

    // Draw traffic flow if test traffic exists
    if (testTraffic) {
      drawTrafficFlow(ctx, sourceX, destinationX, firewallX, centerY, testTraffic)
    }

    // Draw legend
    drawLegend(ctx, width, height)
  }

  const drawComputer = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) => {
    // Draw computer icon
    ctx.fillStyle = color
    ctx.fillRect(x - 30, y, 60, 40)
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(x - 25, y + 5, 50, 30)
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(x - 20, y + 10, 40, 20)

    // Draw stand
    ctx.fillStyle = color
    ctx.fillRect(x - 15, y + 40, 30, 10)
    ctx.fillRect(x - 25, y + 50, 50, 5)

    // Draw label
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(label, x, y + 80)

    // Draw IP if test traffic exists
    if (label === "Client" && testTraffic) {
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.fillText(testTraffic.sourceIp, x, y + 100)
    } else if (label === "Server" && testTraffic) {
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.fillText(testTraffic.destinationIp, x, y + 100)
    }
  }

  const drawFirewall = (ctx: CanvasRenderingContext2D, x: number, y: number, rules: FirewallRule[]) => {
    // Draw firewall icon
    const firewallHeight = Math.max(150, rules.length * 20 + 50)
    const firewallY = y - firewallHeight / 2

    // Draw firewall body
    ctx.fillStyle = "#f97316"
    ctx.fillRect(x - 40, firewallY, 80, firewallHeight)

    // Draw brick pattern
    ctx.fillStyle = "#ea580c"
    for (let i = 0; i < firewallHeight; i += 20) {
      for (let j = 0; j < 2; j++) {
        const offsetX = j * 40
        const offsetY = i % 40 === 0 ? 0 : 10
        ctx.fillRect(x - 40 + offsetX, firewallY + i + offsetY, 35, 15)
      }
    }

    // Draw label
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Firewall", x, firewallY - 10)

    // Draw rule indicators
    if (rules.length > 0) {
      const ruleHeight = 20
      const startY = firewallY + 25

      rules.forEach((rule, index) => {
        const ruleY = startY + index * ruleHeight
        const ruleColor = rule.action === "allow" ? "#22c55e" : "#ef4444"

        // Draw rule indicator
        ctx.fillStyle = ruleColor
        ctx.fillRect(x - 30, ruleY, 60, 3)

        // Draw rule number
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(rule.priority.toString(), x, ruleY + 3)
      })
    }
  }

  const drawTrafficFlow = (
    ctx: CanvasRenderingContext2D,
    sourceX: number,
    destinationX: number,
    firewallX: number,
    centerY: number,
    testTraffic: TestTraffic,
  ) => {
    const packetSize = 10
    const flowY = centerY + 50

    // Draw flow line
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(sourceX, flowY)
    ctx.lineTo(destinationX, flowY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw packet
    const packetColor = testTraffic.result === "allowed" ? "#22c55e" : "#ef4444"

    // Draw packet before firewall
    ctx.fillStyle = packetColor
    ctx.beginPath()
    ctx.moveTo(sourceX + 50, flowY - packetSize)
    ctx.lineTo(sourceX + 50 + packetSize, flowY)
    ctx.lineTo(sourceX + 50, flowY + packetSize)
    ctx.lineTo(sourceX + 50 - packetSize, flowY)
    ctx.closePath()
    ctx.fill()

    // Draw protocol and port label
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${testTraffic.protocol.toUpperCase()}:${testTraffic.port}`, sourceX + 50, flowY + 25)

    // If allowed, draw packet after firewall
    if (testTraffic.result === "allowed") {
      ctx.fillStyle = packetColor
      ctx.beginPath()
      ctx.moveTo(destinationX - 50, flowY - packetSize)
      ctx.lineTo(destinationX - 50 + packetSize, flowY)
      ctx.lineTo(destinationX - 50, flowY + packetSize)
      ctx.lineTo(destinationX - 50 - packetSize, flowY)
      ctx.closePath()
      ctx.fill()
    }

    // Draw result label
    ctx.fillStyle = packetColor
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(testTraffic.result.toUpperCase(), firewallX, flowY + 40)
  }

  const drawLegend = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const legendX = 20
    const legendY = height - 70
    const itemSpacing = 25

    // Draw legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fillRect(legendX, legendY, 150, 60)
    ctx.strokeStyle = "#e2e8f0"
    ctx.strokeRect(legendX, legendY, 150, 60)

    // Draw allow indicator
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(legendX + 10, legendY + 15, 20, 10)
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Allow Rule", legendX + 40, legendY + 22)

    // Draw deny indicator
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(legendX + 10, legendY + 15 + itemSpacing, 20, 10)
    ctx.fillStyle = "#1e293b"
    ctx.fillText("Deny Rule", legendX + 40, legendY + 22 + itemSpacing)
  }

  return <canvas ref={canvasRef} className="w-full h-[400px]" />
}
