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
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted">
              <Receipt className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground leading-tight">
              Costo de la decoración
            </span>
          </div>
          <p className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground tabular-nums leading-none">
            {formatCurrency(summary.totalCost)}
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Incluye materiales, mano de obra y todos los gastos del evento
          </p>
        </div>

        {/* Precio sugerido al cliente - DESTACADA */}
        <div className="relative rounded-2xl border-2 border-primary bg-primary/5 p-5 sm:p-6 shadow-card transition-all duration-300 hover:shadow-elevated ring-1 ring-primary/10">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
              Recomendado
            </span>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15">
              <BadgeDollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground leading-tight">
              Precio sugerido al cliente
            </span>
          </div>
          <p className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground tabular-nums leading-none">
            {formatCurrency(summary.finalPrice)}
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Precio recomendado con margen del {marginPercentage}% aplicado
          </p>
        </div>

        {/* Ganancia en este evento */}
        <div className="relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft transition-all duration-300 hover:shadow-card">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-profit-high/10">
              <TrendingUp className="w-5 h-5 text-profit-high" />
            </div>
            <span className="text-sm font-medium text-muted-foreground leading-tight">
              Ganancia de esta decoración
            </span>
          </div>
          <p className={cn(
            'text-4xl sm:text-5xl font-bold tracking-tight tabular-nums leading-none',
            netProfit > 0 ? 'text-profit-high' : 'text-profit-low'
          )}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Precio al cliente ({formatCurrency(summary.finalPrice)}) − costo del evento ({formatCurrency(summary.totalCost)})
          </p>
        </div>
      </div>

    </div>
  );
}
