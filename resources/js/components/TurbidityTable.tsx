

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TurbidityLog {
  id: number
  ntu_value: number
  timestamp: string
}

const chartConfig = {
  turbidity: {
    label: "Turbidity (NTU)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TurbidityTable() {
  const [timeRange, setTimeRange] = useState("90d")
  const [showDetails, setShowDetails] = useState(false)
  const [logs, setLogs] = useState<TurbidityLog[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/turbidity")
      const data = await res.json()
      setLogs(data)
    } catch (err) {
      console.error("Failed to fetch turbidity data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const filteredData = logs.filter((item) => {
    const date = new Date(item.timestamp)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Turbidity Monitoring</CardTitle>
          <CardDescription>
            Showing turbidity values (NTU) over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a time range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTurbidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-turbidity)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-turbidity)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="ntu_value"
              name="Turbidity"
              type="natural"
              fill="url(#fillTurbidity)"
              stroke="var(--color-turbidity)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
        </div>

        {showDetails && (
          <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Detailed Turbidity Data</h3>
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Turbidity (NTU)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="px-4 py-2">{log.id}</td>
                      <td className="px-4 py-2">
                        {new Date(log.timestamp).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2">{log.ntu_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
