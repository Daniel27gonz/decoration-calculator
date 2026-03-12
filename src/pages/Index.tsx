import { useState } from "react";
import { Plus, Trash2, Calculator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DecorationItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

const Index = () => {
  const [items, setItems] = useState<DecorationItem[]>([]);
  const [profitPercent, setProfitPercent] = useState(30);
  const [laborCost, setLaborCost] = useState(0);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, unitPrice: 0 });

  const addItem = () => {
    if (!newItem.name || newItem.unitPrice <= 0) return;
    setItems([...items, { ...newItem, id: crypto.randomUUID() }]);
    setNewItem({ name: "", quantity: 1, unitPrice: 0 });
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const materialsCost = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalCost = materialsCost + laborCost;
  const profit = totalCost * (profitPercent / 100);
  const finalPrice = totalCost + profit;

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Calculadora de Decoraciones
          </h1>
          <p className="mt-2 text-muted-foreground">
            Calcula el precio final con ganancia incluida
          </p>
        </div>

        {/* Add item form */}
        <Card className="mb-6 shadow-lg border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Agregar Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_80px_100px_auto]">
              <Input
                placeholder="Nombre del material"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />
              <Input
                type="number"
                min={1}
                placeholder="Cant."
                value={newItem.quantity || ""}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              />
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="Precio $"
                value={newItem.unitPrice || ""}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
              />
              <Button onClick={addItem} className="gap-1">
                <Plus className="h-4 w-4" /> Agregar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items list */}
        {items.length > 0 && (
          <Card className="mb-6 shadow-lg border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Materiales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"
                >
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Labor & profit config */}
        <Card className="mb-6 shadow-lg border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Costos Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Mano de Obra ($)
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={laborCost || ""}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Ganancia (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={500}
                  value={profitPercent || ""}
                  onChange={(e) => setProfitPercent(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="overflow-hidden shadow-xl border-0">
          <div className="bg-gradient-to-br from-primary to-accent p-6 text-center">
            <Calculator className="mx-auto mb-2 h-8 w-8 text-primary-foreground/80" />
            <h2 className="text-xl font-bold text-primary-foreground">Resumen de Precio</h2>
          </div>
          <CardContent className="space-y-3 p-6">
            <div className="flex justify-between text-foreground">
              <span>Costo de materiales</span>
              <span className="font-medium">${materialsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Mano de obra</span>
              <span className="font-medium">${laborCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Costo total</span>
              <span className="font-medium">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-accent">
              <span>Ganancia ({profitPercent}%)</span>
              <span className="font-semibold">+${profit.toFixed(2)}</span>
            </div>
            <div className="mt-2 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">Precio Final</span>
                <span className="text-2xl font-bold text-primary">
                  ${finalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
