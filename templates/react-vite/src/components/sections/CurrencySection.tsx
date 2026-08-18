import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CurrencyRatesSchema,
  POPULAR_CURRENCIES,
  type CurrencyRates,
} from "@/schemas/CurrencySchema";
import { RefreshCw, TrendingUp, AlertCircle, ArrowRightLeft } from "lucide-react";

export function CurrencySection() {
  const [ratesData, setRatesData] = useState<CurrencyRates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(100);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Direct Axios request bypassing local API interceptors and base URLs
      const res = await axios.get("https://open.er-api.com/v6/latest/USD", {
        timeout: 8000,
      });

      const parsed = CurrencyRatesSchema.safeParse(res.data);
      if (parsed.success) {
        setRatesData(parsed.data);
      } else {
        setError("Invalid response format received from currency API.");
      }
    } catch {
      setError("Unable to reach exchange rate service. Check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const formatCurrency = (val: number, code: string) => {
    if (code === "IDR" || code === "JPY") {
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <section id="currency" className="py-16 md:py-24 border-t border-border/40 bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              External API Example
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Live Currency Exchange Rates
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Direct external API consumption with Axios, runtime Zod validation, and loading skeleton states.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRates}
              disabled={isLoading}
              className="gap-2 text-xs h-9 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Rates
            </Button>
          </div>
        </div>

        {/* Converter Calculator */}
        <Card className="p-4 sm:p-6 border-border/60 bg-card shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground shrink-0">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              Convert Base:
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-muted border border-border">
                USD ($)
              </span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 0))}
                className="h-9 w-full sm:w-36 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Amount in USD"
              />
            </div>
            <p className="text-xs text-muted-foreground sm:ml-auto">
              {ratesData?.time_last_update_utc
                ? `Last update: ${ratesData.time_last_update_utc.slice(0, 16)}`
                : "Updating in real-time"}
            </p>
          </div>
        </Card>

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex items-center justify-between text-xs text-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchRates}
              className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Rates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-5 border-border/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-3 w-20" />
                </Card>
              ))
            : POPULAR_CURRENCIES.map((currency) => {
                const rate = ratesData?.rates[currency.code] || 1;
                const converted = amount * rate;

                return (
                  <Card
                    key={currency.code}
                    className="p-5 border-border/60 bg-card hover:border-border transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <span className="text-sm">{currency.flag}</span>
                        {currency.code}
                      </span>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        1 USD = {formatCurrency(rate, currency.code)}
                      </Badge>
                    </div>

                    <div className="pt-2">
                      <p className="text-xl font-bold tracking-tight text-foreground font-mono">
                        {currency.symbol} {formatCurrency(converted, currency.code)}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate pt-0.5">
                        {currency.name}
                      </p>
                    </div>
                  </Card>
                );
              })}
        </div>
      </div>
    </section>
  );
}
