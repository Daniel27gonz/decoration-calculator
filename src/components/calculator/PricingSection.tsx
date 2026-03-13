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
        {/* COSTO DEL EVENTO */}
        <div className="rounded-xl border border-[#D1D5DB] bg-[#F3F4F6] p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#E5E7EB] shrink-0">
              <Receipt className="w-4 h-4 text-[#6B7280]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#374151] leading-tight uppercase">
              Costo del evento
            </h3>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-[#374151] tabular-nums">
            {formatCurrency(summary.totalCost)}
          </p>
          <p className="text-[11px] text-[#9CA3AF] mt-2">
            Materiales + mano de obra + gastos
          </p>
        </div>

        {/* PRECIO SUGERIDO AL CLIENTE */}
        <div className="relative rounded-xl border-2 border-[#EC4899] bg-[#FCE7F3] p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FBCFE8] shrink-0">
              <BadgeDollarSign className="w-4 h-4 text-[#BE185D]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#BE185D] leading-tight uppercase">
              Precio sugerido al cliente
            </h3>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-[#BE185D] tabular-nums">
            {formatCurrency(summary.finalPrice)}
          </p>
          <p className="text-[11px] text-[#9CA3AF] mt-2">
            Con margen del {marginPercentage}% aplicado
          </p>
        </div>

        {/* TU GANANCIA */}
        <div className="rounded-xl border border-[#22C55E] bg-[#DCFCE7] p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#BBF7D0] shrink-0">
              <TrendingUp className="w-4 h-4 text-[#15803D]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#15803D] leading-tight uppercase">
              Tu ganancia
            </h3>
          </div>
          <p className={cn(
            'text-lg sm:text-xl font-semibold tabular-nums',
            netProfit > 0 ? 'text-[#15803D]' : 'text-[#DC2626]'
          )}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-[11px] text-[#9CA3AF] mt-2">
            {formatCurrency(summary.finalPrice)} − {formatCurrency(summary.totalCost)}
          </p>
        </div>
      </div>
    </div>
  );
}
