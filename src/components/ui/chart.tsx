"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "./utils";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps>({
  config: {},
});

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        id={id}
        className={cn("h-full w-full", className)}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  return (
    <style
      id={id}
      dangerouslySetInnerHTML={{
        __html: `
          [data-chart="${id}"] {
            --chart-background: ${config.background || "hsl(var(--background))"};
            --chart-foreground: ${config.foreground || "hsl(var(--foreground))"};
            --chart-primary: ${config.primary || "hsl(var(--primary))"};
            --chart-primary-foreground: ${config.primaryForeground || "hsl(var(--primary-foreground))"};
            --chart-secondary: ${config.secondary || "hsl(var(--secondary))"};
            --chart-secondary-foreground: ${config.secondaryForeground || "hsl(var(--secondary-foreground))"};
            --chart-muted: ${config.muted || "hsl(var(--muted))"};
            --chart-muted-foreground: ${config.mutedForeground || "hsl(var(--muted-foreground))"};
            --chart-accent: ${config.accent || "hsl(var(--accent))"};
            --chart-accent-foreground: ${config.accentForeground || "hsl(var(--accent-foreground))"};
            --chart-destructive: ${config.destructive || "hsl(var(--destructive))"};
            --chart-destructive-foreground: ${config.destructiveForeground || "hsl(var(--destructive-foreground))"};
            --chart-border: ${config.border || "hsl(var(--border))"};
            --chart-input: ${config.input || "hsl(var(--input))"};
            --chart-ring: ${config.ring || "hsl(var(--ring))"};
            --chart-radius: ${config.radius || "0.5rem"};
          }
        `,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartLegend = RechartsPrimitive.Legend;

// Helper function
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  return undefined;
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartLegend,
  useChart,
  getPayloadConfigFromPayload,
};
