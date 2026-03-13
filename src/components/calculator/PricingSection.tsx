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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Costo de la decoración */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0">
              <Receipt className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-muted-foreground leading-snug">
              Costo de la decoración
            </h3>
          </div>
          <p className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground/70 tabular-nums leading-none">
            {formatCurrency(summary.totalCost)}
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-2.5">
            Materiales + mano de obra + gastos
          </p>
        </div>

        {/* Precio sugerido al cliente */}
        <div className="relative rounded-xl border-2 border-primary/40 bg-primary/10 p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Recomendado
            </span>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
              <BadgeDollarSign className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-primary leading-snug">
              Precio sugerido al cliente
            </h3>
          </div>
          <p className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary tabular-nums leading-none">
            {formatCurrency(summary.finalPrice)}
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-2.5">
            Con margen del {marginPercentage}% aplicado
          </p>
        </div>

        {/* Ganancia de esta decoración */}
        <div className="rounded-xl border border-profit-high/30 bg-profit-high/10 p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-profit-high/10 shrink-0">
              <TrendingUp className="w-4 h-4 text-profit-high" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-profit-high leading-snug">
              Ganancia de esta decoración
            </h3>
          </div>
          <p className={cn(
            'text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums leading-none',
            netProfit > 0 ? 'text-profit-high' : 'text-profit-low'
          )}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-2.5">
            {formatCurrency(summary.finalPrice)} − {formatCurrency(summary.totalCost)}
          </p>
        </div>
      </div>
    </div>
  );
}
