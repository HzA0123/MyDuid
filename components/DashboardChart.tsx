"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface ChartData {
    name: string;
    income: number;
    expense: number;
}

export function DashboardChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400">
                <p>No data available yet.</p>
            </div>
        );
    }

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `Rp${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        formatter={(value: number | undefined) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(value) || 0)}
                    />
                    <Area type="monotone" dataKey="income" name="Income" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
