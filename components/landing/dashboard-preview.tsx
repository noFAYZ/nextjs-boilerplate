'use client';

import Image from 'next/image';

export function DashboardPreview() {
  return (
    <section className="py-20 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Beautiful Dashboard, Powerful Insights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a complete view of your financial health with our intuitive dashboard
            </p>
          </div>

          {/* Preview Card with Gradient Glow */}
          <div className="relative">
            {/* Gradient glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 dark:from-orange-500/10 dark:via-amber-500/10 dark:to-yellow-500/10 blur-3xl opacity-60" />

            {/* Main preview card */}
            <div className="relative rounded-2xl border bg-card p-4 md:p-6 shadow-2xl">
              {/* Placeholder Image Container */}
              <div className="relative rounded-xl overflow-hidden bg-muted border aspect-[16/10]">
                {/* You can replace this with an actual image */}
                {/* Uncomment below and add your dashboard screenshot */}
                {/* <Image
                  src="/images/dashboard-preview.png"
                  alt="MoneyMappr Dashboard Preview"
                  fill
                  className="object-cover"
                  priority
                /> */}

                {/* Placeholder Design */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                      }}
                    />
                  </div>

                  {/* Placeholder Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12">
                    {/* Decorative Cards */}
                    <div className="relative w-full max-w-4xl">
                      {/* Top Card */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md">
                        <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-6 shadow-2xl">
                          <div className="h-4 w-32 bg-white/30 rounded mb-3" />
                          <div className="h-8 w-48 bg-white/50 rounded mb-4" />
                          <div className="grid grid-cols-3 gap-3">
                            <div className="h-3 bg-white/30 rounded" />
                            <div className="h-3 bg-white/30 rounded" />
                            <div className="h-3 bg-white/30 rounded" />
                          </div>
                        </div>
                      </div>

                      {/* Left Card */}
                      <div className="absolute top-24 left-4 md:left-12">
                        <div className="rounded-lg bg-card border p-4 shadow-xl w-48">
                          <div className="h-3 w-20 bg-muted rounded mb-2" />
                          <div className="h-6 w-28 bg-muted rounded mb-3" />
                          <div className="h-2 w-16 bg-orange-200 dark:bg-orange-900 rounded" />
                        </div>
                      </div>

                      {/* Right Card */}
                      <div className="absolute top-24 right-4 md:right-12">
                        <div className="rounded-lg bg-card border p-4 shadow-xl w-48">
                          <div className="h-3 w-24 bg-muted rounded mb-2" />
                          <div className="h-6 w-32 bg-muted rounded mb-3" />
                          <div className="h-2 w-20 bg-orange-200 dark:bg-orange-900 rounded" />
                        </div>
                      </div>

                      {/* Bottom Chart */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg">
                        <div className="rounded-lg bg-card border p-4 shadow-xl">
                          <div className="h-3 w-32 bg-muted rounded mb-4" />
                          <div className="flex items-end justify-between gap-2 h-24">
                            {[40, 65, 55, 80, 70, 90, 85, 95].map((height, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-t opacity-70"
                                style={{ height: `${height}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center z-10 bg-background/80 dark:bg-background/60 backdrop-blur-sm rounded-2xl p-8 border shadow-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Dashboard Preview
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Replace with actual screenshot
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional: Feature badges below preview */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium">Real-time updates</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                  <span className="font-medium">Multi-chain support</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                  <span className="font-medium">Advanced analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
