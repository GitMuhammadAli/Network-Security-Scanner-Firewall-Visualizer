"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

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
  3306: "MySQL",
  3389: "RDP",
  5432: "PostgreSQL",
  8080: "HTTP Alternate",
}

export default function NetworkScanner() {
  const [target, setTarget] = useState("192.168.1.1")
  const [scanType, setScanType] = useState("tcp")
  const [portRange, setPortRange] = useState("1-1000")
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<ScanResult[]>([])
  const [error, setError] = useState("")

  const handleScan = async () => {
    if (!target) {
      setError("Please enter a target IP or hostname")
      return
    }

    setIsScanning(true)
    setError("")

    try {
      // Simulate network scanning with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock scan results for preview
      const mockResults: ScanResult[] = []
      const ports = [22, 80, 443, 3306, 8080, 21, 25, 53]

      for (const port of ports) {
        // Randomize status for demonstration
        const random = Math.random()
        let status: "open" | "closed" | "filtered"

        if (random < 0.6) {
          status = "open"
        } else if (random < 0.8) {
          status = "filtered"
        } else {
          status = "closed"
        }

        mockResults.push({
          ip: target,
          port,
          service: commonServices[port] || "Unknown",
          status,
        })
      }

      setResults(mockResults)
    } catch (err) {
      setError("An error occurred during scanning")
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target IP or Hostname</Label>
              <Input
                id="target"
                placeholder="e.g., 192.168.1.1 or example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scan-type">Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger id="scan-type">
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tcp">TCP SYN</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="full">Full Connect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="port-range">Port Range</Label>
              <Input
                id="port-range"
                placeholder="e.g., 1-1000 or 80,443,8080"
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleScan} disabled={isScanning} className="w-full">
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Start Scan"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div>
        <h2 className="text-xl font-semibold mb-4">Scan Results</h2>
        {results.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.ip}</TableCell>
                  <TableCell>{result.port}</TableCell>
                  <TableCell>{result.service}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === "open"
                          ? "bg-green-100 text-green-800"
                          : result.status === "filtered"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-gray-500 border rounded-md">
            No scan results yet. Start a scan to see results here.
          </div>
        )}
      </div>
    </div>
  )
}
