"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ArrowUp, ArrowDown } from "lucide-react"
import FirewallVisualizer from "@/components/firewall-visualizer"

type FirewallRule = {
  id: string
  action: "allow" | "deny"
  sourceIp: string
  destinationIp: string
  port: string
  protocol: "tcp" | "udp" | "icmp" | "any"
  priority: number
}

export default function FirewallSimulator() {
  const [rules, setRules] = useState<FirewallRule[]>([
    {
      id: "1",
      action: "allow",
      sourceIp: "192.168.1.0/24",
      destinationIp: "any",
      port: "80",
      protocol: "tcp",
      priority: 1,
    },
    {
      id: "2",
      action: "deny",
      sourceIp: "any",
      destinationIp: "10.0.0.1",
      port: "22",
      protocol: "tcp",
      priority: 2,
    },
  ])
  const [action, setAction] = useState<"allow" | "deny">("deny")
  const [sourceIp, setSourceIp] = useState("")
  const [destinationIp, setDestinationIp] = useState("")
  const [port, setPort] = useState("")
  const [protocol, setProtocol] = useState<"tcp" | "udp" | "icmp" | "any">("any")
  const [testSourceIp, setTestSourceIp] = useState("192.168.1.5")
  const [testDestinationIp, setTestDestinationIp] = useState("10.0.0.1")
  const [testPort, setTestPort] = useState("80")
  const [testProtocol, setTestProtocol] = useState<"tcp" | "udp" | "icmp" | "any">("tcp")
  const [testResult, setTestResult] = useState<"allowed" | "blocked" | null>("allowed")

  const addRule = () => {
    if (!sourceIp || !destinationIp || !port) return

    const newRule: FirewallRule = {
      id: Date.now().toString(),
      action,
      sourceIp,
      destinationIp,
      port,
      protocol,
      priority: rules.length + 1,
    }

    setRules([...rules, newRule])

    // Reset form
    setSourceIp("")
    setDestinationIp("")
    setPort("")
    setProtocol("any")
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const moveRuleUp = (index: number) => {
    if (index === 0) return
    const newRules = [...rules]
    ;[newRules[index - 1], newRules[index]] = [newRules[index], newRules[index - 1]]

    // Update priorities
    newRules.forEach((rule, idx) => {
      rule.priority = idx + 1
    })

    setRules(newRules)
  }

  const moveRuleDown = (index: number) => {
    if (index === rules.length - 1) return
    const newRules = [...rules]
    ;[newRules[index], newRules[index + 1]] = [newRules[index + 1], newRules[index]]

    // Update priorities
    newRules.forEach((rule, idx) => {
      rule.priority = idx + 1
    })

    setRules(newRules)
  }

  const testTraffic = () => {
    if (!testSourceIp || !testDestinationIp || !testPort) return

    // Check if any rule blocks the traffic
    for (const rule of rules) {
      const sourceMatch = rule.sourceIp === "any" || rule.sourceIp === testSourceIp
      const destMatch = rule.destinationIp === "any" || rule.destinationIp === testDestinationIp
      const portMatch = rule.port === "any" || rule.port === testPort
      const protocolMatch = rule.protocol === "any" || rule.protocol === testProtocol

      if (sourceMatch && destMatch && portMatch && protocolMatch) {
        setTestResult(rule.action === "allow" ? "allowed" : "blocked")
        return
      }
    }

    // Default policy: allow if no rules match
    setTestResult("allowed")
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Firewall Rules</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Select value={action} onValueChange={(value: "allow" | "deny") => setAction(value)}>
                    <SelectTrigger id="action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allow">Allow</SelectItem>
                      <SelectItem value="deny">Deny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select
                    value={protocol}
                    onValueChange={(value: "tcp" | "udp" | "icmp" | "any") => setProtocol(value)}
                  >
                    <SelectTrigger id="protocol">
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="icmp">ICMP</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-ip">Source IP</Label>
                <Input
                  id="source-ip"
                  placeholder="e.g., 192.168.1.1 or any"
                  value={sourceIp}
                  onChange={(e) => setSourceIp(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination-ip">Destination IP</Label>
                <Input
                  id="destination-ip"
                  placeholder="e.g., 10.0.0.1 or any"
                  value={destinationIp}
                  onChange={(e) => setDestinationIp(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder="e.g., 80 or 1-1024 or any"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </div>

              <Button onClick={addRule} className="w-full">
                Add Rule
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Test Traffic</h3>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-source-ip">Source IP</Label>
                    <Input
                      id="test-source-ip"
                      placeholder="e.g., 192.168.1.1"
                      value={testSourceIp}
                      onChange={(e) => setTestSourceIp(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-protocol">Protocol</Label>
                    <Select
                      value={testProtocol}
                      onValueChange={(value: "tcp" | "udp" | "icmp" | "any") => setTestProtocol(value)}
                    >
                      <SelectTrigger id="test-protocol">
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                        <SelectItem value="icmp">ICMP</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test-destination-ip">Destination IP</Label>
                  <Input
                    id="test-destination-ip"
                    placeholder="e.g., 10.0.0.1"
                    value={testDestinationIp}
                    onChange={(e) => setTestDestinationIp(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test-port">Port</Label>
                  <Input
                    id="test-port"
                    placeholder="e.g., 80"
                    value={testPort}
                    onChange={(e) => setTestPort(e.target.value)}
                  />
                </div>

                <Button onClick={testTraffic} className="w-full">
                  Test Traffic
                </Button>

                {testResult && (
                  <div
                    className={`mt-4 p-3 rounded text-center font-medium ${
                      testResult === "allowed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    Traffic is {testResult.toUpperCase()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Rule List</h2>
          {rules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule, index) => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          rule.action === "allow" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rule.action}
                      </span>
                    </TableCell>
                    <TableCell>{rule.sourceIp}</TableCell>
                    <TableCell>{rule.destinationIp}</TableCell>
                    <TableCell>{rule.port}</TableCell>
                    <TableCell>{rule.protocol}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="icon" onClick={() => moveRuleUp(index)} disabled={index === 0}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveRuleDown(index)}
                          disabled={index === rules.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => removeRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-gray-500 border rounded-md">
              No rules defined yet. Add rules to see them here.
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Traffic Flow Visualization</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <FirewallVisualizer
                  rules={rules}
                  testTraffic={
                    testResult
                      ? {
                          sourceIp: testSourceIp,
                          destinationIp: testDestinationIp,
                          port: testPort,
                          protocol: testProtocol,
                          result: testResult,
                        }
                      : null
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
