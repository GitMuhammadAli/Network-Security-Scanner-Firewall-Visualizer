import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NetworkScanner from "@/components/network-scanner"
import FirewallSimulator from "@/components/firewall-simulator"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Network Security Scanner & Firewall Visualizer</h1>
        <p className="text-gray-500 mb-6">Scan networks for vulnerabilities and simulate firewall rules</p>

        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="scanner">Network Scanner</TabsTrigger>
            <TabsTrigger value="firewall">Firewall Simulator</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <NetworkScanner />
          </TabsContent>

          <TabsContent value="firewall">
            <FirewallSimulator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
