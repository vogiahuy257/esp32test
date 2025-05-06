import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button"; 

interface TurbidityLog {
  id: number;
  ntu_value: number;
  timestamp: string;
}

export default function TurbidityTable() {
  const [logs, setLogs] = useState<TurbidityLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    fetch("/api/turbidity")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Failed to fetch turbidity data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Turbidity Logs</h2>
          <Button onClick={fetchLogs} disabled={loading}>
            {loading ? "Loading..." : "Reset"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>NTU Value</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.ntu_value}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
