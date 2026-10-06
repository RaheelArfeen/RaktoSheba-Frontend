'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TimeSeries } from '@/types';

interface AdminChartsProps {
  timeSeries: TimeSeries;
}

export function AdminCharts({ timeSeries }: AdminChartsProps) {
  return (
    <div className="rounded-[24px] border border-ink/10 bg-cream p-6 space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="daily-chart-heading">
          <h2 id="daily-chart-heading" className="font-extrabold text-sm mb-4">
            Last 30 days
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeSeries.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,41,36,.08)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                }
              />
              <YAxis tick={{ fontSize: 11 }} width={28} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '14px',
                  border: '1px solid rgba(62,41,36,.1)',
                  background: '#fdfaf7',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#A92836"
                fill="#A92836"
                fillOpacity={0.12}
              />
              <Area
                type="monotone"
                dataKey="donations"
                stroke="#2D7A5F"
                fill="#2D7A5F"
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section aria-labelledby="blood-chart-heading">
          <h2 id="blood-chart-heading" className="font-extrabold text-sm mb-4">
            Open requests by blood group
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeSeries.byBloodGroup}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62,41,36,.08)" />
              <XAxis
                dataKey="bloodGroup"
                tick={{ fontSize: 11 }}
                tickFormatter={(g: string) =>
                  g.replace('_POSITIVE', '+').replace('_NEGATIVE', '−')
                }
              />
              <YAxis tick={{ fontSize: 11 }} width={28} allowDecimals={false} />
              <Bar dataKey="open" fill="#A92836" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}
