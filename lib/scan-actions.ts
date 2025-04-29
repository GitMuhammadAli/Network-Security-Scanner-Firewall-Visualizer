"use server"

import { setTimeout } from "timers/promises"
import { isIP } from "net"
import dns from "dns/promises"

type ScanResult = {
  ip: string
  port: number
  service: string
  status: "open" | "closed" | "filtered"
}

// Common service names for well-known ports
const commonServices: Record<number, string> = {
  20: "FTP Data",
  21: "FTP Control",
  22: "SSH",
  23: "Telnet",
  25: "SMTP",
  53: "DNS",
  80: "HTTP",
  110: "POP3",
  143: "IMAP",
  443: "HTTPS",
  465: "SMTPS",
  587: "SMTP Submission",
  993: "IMAPS",
  995: "POP3S",
  3306: "MySQL",
  3389: "RDP",
  5432: "PostgreSQL",
  8080: "HTTP Alternate",
  8443: "HTTPS Alternate",
}

// Get service name for a port
const getServiceName = (port: number): string => {
  return commonServices[port] || "Unknown"
}

// Parse port range string into array of ports
const parsePortRange = (portRange: string): number[] => {
  const ports: number[] = []

  // Handle comma-separated list
  if (portRange.includes(",")) {
    const portList = portRange.split(",")
    for (const port of portList) {
      const trimmedPort = port.trim()
      const portNum = Number.parseInt(trimmedPort, 10)
      if (!isNaN(portNum) && portNum > 0 && portNum < 65536) {
        ports.push(portNum)
      }
    }
    return ports
  }

  // Handle range (e.g., 1-1000)
  if (portRange.includes("-")) {
    const [startStr, endStr] = portRange.split("-")
    const start = Number.parseInt(startStr.trim(), 10)
    const end = Number.parseInt(endStr.trim(), 10)

    if (!isNaN(start) && !isNaN(end) && start > 0 && end < 65536 && start <= end) {
      // Limit the range to prevent excessive scanning
      const maxRange = 1000
      const actualEnd = Math.min(end, start + maxRange - 1)

      for (let i = start; i <= actualEnd; i++) {
        ports.push(i)
      }
    }
    return ports
  }

  // Handle single port
  const portNum = Number.parseInt(portRange.trim(), 10)
  if (!isNaN(portNum) && portNum > 0 && portNum < 65536) {
    ports.push(portNum)
  }

  return ports
}

// Resolve hostname to IP address
const resolveHostname = async (target: string): Promise<string> => {
  if (isIP(target)) {
    return target
  }

  try {
    const result = await dns.lookup(target)
    return result.address
  } catch (error) {
    throw new Error(`Could not resolve hostname: ${target}`)
  }
}

// Simulate port scanning
// In a real application, this would use actual network scanning libraries
export async function scanNetwork(target: string, scanType: string, portRange: string): Promise<ScanResult[]> {
  try {
    // Resolve hostname to IP
    const ip = await resolveHostname(target)

    // Parse port range
    const ports = parsePortRange(portRange)
    if (ports.length === 0) {
      throw new Error("Invalid port range specified")
    }

    // Limit number of ports to scan
    const maxPorts = 100
    const portsToScan = ports.slice(0, maxPorts)

    // Simulate scanning delay
    await setTimeout(1500)

    // Generate simulated results
    // In a real application, this would perform actual network scans
    const results: ScanResult[] = []

    for (const port of portsToScan) {
      // Simulate different scan results based on port number
      // This is just for demonstration purposes
      let status: "open" | "closed" | "filtered"

      // Common open ports for simulation
      const commonOpenPorts = [22, 80, 443, 3306, 8080]
      const isCommonPort = commonOpenPorts.includes(port)

      // Randomize some results, but keep common ports mostly open
      const random = Math.random()
      if (isCommonPort && random < 0.8) {
        status = "open"
      } else if (random < 0.2) {
        status = "open"
      } else if (random < 0.5) {
        status = "filtered"
      } else {
        status = "closed"
      }

      // Add scan result
      results.push({
        ip,
        port,
        service: getServiceName(port),
        status,
      })
    }

    return results
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unknown error occurred during scanning")
  }
}
