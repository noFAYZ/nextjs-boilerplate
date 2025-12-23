import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { CurrencyDisplay } from "../ui/currency-display";
import clsx from "clsx";
import { useLogoGradient } from "@/lib/utils/useGradientFromImage";

interface BaseAccountProps {
  account: any;
  logo?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_MAP = {
  xs: { w: "w-44", h: "h-24", px: "px-3", py: "py-2", text: "text-[9px]" },
  sm: { w: "w-52", h: "h-28", px: "px-4", py: "py-3", text: "text-[10px]" },
  md: { w: "w-60", h: "h-32", px: "px-5", py: "py-4", text: "text-[11px]" },
  lg: { w: "w-72", h: "h-40", px: "px-6", py: "py-5", text: "text-[12px]" },
};

/* ---------------------- Vehicle Card ---------------------- */
export function VehicleCard({ account, logo, size = "md" }: BaseAccountProps) {
  const { name, type, color, icon } = account;
  const { gradient } = useLogoGradient(logo ?? "");

  const s = SIZE_MAP[size];

  return (
    <Card
      interactive
      className={clsx(
        s.w,
        s.h,
        s.px,
        s.py,
        "rounded-2xl text-white shadow-2xl flex flex-col justify-between transition-transform transform-gpu hover:scale-105 hover:shadow-3xl",
        "bg-gradient-to-tr from-gray-900 via-gray-800 to-black"
      )}
      style={{ backgroundImage: gradient ?? undefined }}
      key={account.id}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {logo ? (
            <Avatar className="shadow-lg w-9 h-9">
              <AvatarImage src={logo} alt={name} />
            </Avatar>
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold">
              {icon ?? name?.[0] ?? "?"}
            </div>
          )}

          <div className="min-w-0">
            <div className={clsx("truncate font-semibold", s.text)}>{name}</div>
            <div className={clsx("truncate text-gray-300", s.text)}>{type}</div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="flex justify-between items-center">
        <div>
          <div className={clsx("uppercase text-gray-300 tracking-wide", s.text)}>Value</div>
          <CurrencyDisplay amountUSD={account.value ?? 0} className={s.text} />
        </div>
        <div>
          <div className={clsx("uppercase text-gray-300 tracking-wide", s.text)}>Mileage</div>
          <div className={clsx(s.text)}>{account.mileage ?? "—"} km</div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------------- Crypto Card ---------------------- */
export function CryptoCard({ account, logo, size = "md" }: BaseAccountProps) {
  const { name, symbol, balance, currency, network, icon } = account;
  const { gradient } = useLogoGradient(logo ?? "");

  const s = SIZE_MAP[size];

  return (
    <Card
      interactive
      className={clsx(
        s.w,
        s.h,
        s.px,
        s.py,
        "rounded-2xl text-white shadow-2xl flex flex-col justify-between transition-transform transform-gpu hover:scale-105 hover:shadow-3xl",
        "bg-gradient-to-tr from-gray-900 via-gray-800 to-black"
      )}
      style={{ backgroundImage: gradient ?? undefined }}
      key={account.id}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {logo ? (
            <Avatar className="shadow-lg w-9 h-9">
              <AvatarImage src={logo} alt={name} />
            </Avatar>
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold">
              {icon ?? symbol?.[0] ?? "?"}
            </div>
          )}

          <div className="min-w-0">
            <div className={clsx("truncate font-semibold", s.text)}>{name}</div>
            <div className={clsx("truncate text-gray-300", s.text)}>{symbol} • {network}</div>
          </div>
        </div>
      </div>

      {/* Crypto Balance */}
      <div>
        <div className={clsx("uppercase text-gray-300 tracking-wide", s.text)}>Balance</div>
        <CurrencyDisplay amountUSD={balance ?? 0} className={s.text} />
      </div>
    </Card>
  );
}
