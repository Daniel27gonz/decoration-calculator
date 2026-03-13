import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CostSummary } from '@/types/quote';
import { useAuth } from '@/contexts/AuthContext';

interface CostBreakdownProps {
  summary: CostSummary;
  wastagePercentage: number;
  currencySymbol?: string;
}

export function CostBreakdown({ summary, wastagePercentage, currencySymbol = '$' }: CostBreakdownProps) {
  const { user, profile } = useAuth();
  const [indirectExpensesTotal, setIndirectExpensesTotal] = useState(0);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`indirect_expenses_${user.id}`);
      if (stored) {
        const expenses = JSON.parse(stored);
        const total = expenses.reduce(
          (sum: number, e: { monthlyAmount: number }) => sum + (e.monthlyAmount || 0),
          0
        );
        setIndirectExpensesTotal(total);
      }
    }
  }, [user]);

  const eventsPerMonth = profile?.events_per_month || 4;

  const formatCurrency = (amount: number) =>
    `${currencySymbol}${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
          <span className="text-lg">📋</span>
          Desglose de costos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50 text-sm">
          <CostLine label="Materiales no reutilizables" amount={formatCurrency(summary.totalMaterials)} />
          <CostLine label="Materiales reutilizables" amount={formatCurrency(summary.totalReusableMaterials)} />
          <CostLine label={`Merma (${wastagePercentage}%)`} amount={formatCurrency(summary.wastage)} />
          <CostLine label="Mano de obra" amount={formatCurrency(summary.totalLabor)} />
          <CostLine label="Transporte" amount={formatCurrency(summary.totalTransport)} />
          <CostLine label="Extras" amount={formatCurrency(summary.totalExtras)} />
          <CostLine
            label="Gastos indirectos"
            sublabel={`${formatCurrency(indirectExpensesTotal)}/mes ÷ ${eventsPerMonth} eventos`}
            amount={formatCurrency(summary.indirectExpenses)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CostLine({ label, sublabel, amount }: { label: string; sublabel?: string; amount: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
      <div className="min-w-0">
        <span className="text-foreground">{label}</span>
        {sublabel && <span className="block text-xs text-muted-foreground">{sublabel}</span>}
      </div>
      <span className="font-semibold tabular-nums text-foreground whitespace-nowrap ml-4">{amount}</span>
    </div>
  );
}
