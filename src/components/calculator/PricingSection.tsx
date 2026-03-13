import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumericField } from '@/components/ui/numeric-field';
import { CostSummary } from '@/types/quote';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Receipt, BadgeDollarSign, TrendingUp } from 'lucide-react';

interface PricingSectionProps {
  summary: CostSummary;
  marginPercentage: number;
  toolWearPercentage: number;
  wastagePercentage: number;
  onMarginChange: (margin: number) => void;
  currencySymbol?: string;
}

const marginOptions = [
  { value: 20, label: '20%', description: 'Económico' },
  { value: 30, label: '30%', description: 'Estándar' },
  { value: 40, label: '40%', description: 'Premium' },
  { value: 50, label: '50%', description: 'Lujo' },
];

export function PricingSection({
  summary,
  marginPercentage,
  toolWearPercentage,
  wastagePercentage,
  onMarginChange,
  currencySymbol = '$',
}: PricingSectionProps) {
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

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const netProfit = summary.finalPrice - summary.totalCost;

  return (
    <div className="space-y-6">
      {/* Margin Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-xl">💰</span>
            Margen de Ganancia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {marginOptions.map(({ value, label, description }) => (
              <Button
                key={value}
                variant={marginPercentage === value ? 'default' : 'outline'}
                className={cn(
                  'flex flex-col h-auto py-3 px-2',
                  marginPercentage === value && 'shadow-card ring-2 ring-primary/20'
                )}
                onClick={() => onMarginChange(value)}
              >
                <span className="font-bold text-base sm:text-lg">{label}</span>
                <span className="text-[10px] sm:text-xs opacity-70 mt-0.5">{description}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Personalizado:</span>
            <NumericField
              min={0}
              max={200}
              value={marginPercentage ?? ''}
              onChange={(e) => onMarginChange(e.target.value === '' ? 0 : Number(e.target.value))}
              suffix="%"
              className="w-24 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Costo por evento */}
        <div className="relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft transition-all duration-300 hover:shadow-card">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted">
              <Receipt className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Costo por evento</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {formatCurrency(summary.totalCost)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Materiales + mano de obra + gastos
          </p>
        </div>

        {/* Precio sugerido al cliente - DESTACADA */}
        <div className="relative rounded-2xl border-2 border-primary bg-primary/5 p-5 sm:p-6 shadow-card transition-all duration-300 hover:shadow-elevated ring-1 ring-primary/10">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Recomendado
            </span>
          </div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15">
              <BadgeDollarSign className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Precio sugerido al cliente</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
            {formatCurrency(summary.finalPrice)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Con margen del {marginPercentage}% aplicado
          </p>
        </div>

        {/* Tu ganancia */}
        <div className="relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft transition-all duration-300 hover:shadow-card">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-profit-high/10">
              <TrendingUp className="w-4.5 h-4.5 text-profit-high" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Tu ganancia</span>
          </div>
          <p className={cn(
            'text-3xl sm:text-4xl font-bold tracking-tight tabular-nums',
            netProfit > 0 ? 'text-profit-high' : 'text-profit-low'
          )}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Precio al cliente − costo del evento
          </p>
        </div>
      </div>

      {/* Cost Breakdown (collapsible detail) */}
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
    </div>
  );
}

function CostLine({
  label,
  sublabel,
  amount,
}: {
  label: string;
  sublabel?: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
      <div className="min-w-0">
        <span className="text-foreground">{label}</span>
        {sublabel && (
          <span className="block text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
      <span className="font-semibold tabular-nums text-foreground whitespace-nowrap ml-4">
        {amount}
      </span>
    </div>
  );
}
