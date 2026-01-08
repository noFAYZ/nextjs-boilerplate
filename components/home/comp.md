   <div className='space-y-4 gap-2 pb-6'>
          <p className="text-xs font-medium text-muted-foreground  tracking-wider mb-2">
            Total Networth
          </p>
          
          <CurrencyDisplay amountUSD={netWorthAmount} variant='3xl'  />

     

          
            {/* Allocation Section - Assets vs Liabilities */}
            {(summaryData?.totalAssets ?? 0) > 0 || (summaryData?.totalLiabilities ?? 0) > 0 ? (
              <div className="space-y-3 mt-4">
                {/* Allocation bar with SVG pattern overlays */}
                <div className="relative w-full h-8 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10">
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

                  {/* SVG Patterns Definition */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <defs>
                      {/* Assets: Diagonal lines pattern */}
                      <pattern id="pattern-ASSETS-BAR" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.2" />
                      </pattern>

                      {/* Liabilities: Dots pattern */}
                      <pattern id="pattern-LIABILITIES-BAR" width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="3" cy="3" r="1.2" fill="white" fillOpacity="0.18" />
                      </pattern>
                    </defs>
                  </svg>

                  {/* Assets bar */}
                  {assetsPercent > 0 && (
                    <div
                      style={{ width: `${assetsPercent}%` }}
                      className="h-full relative inline-block transition-all duration-500 ease-out group"
                    >
                      {/* Base color */}
                      <div className="h-full w-full bg-[rgb(60,99,0)]" />

                      {/* Pattern overlay */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 100"
                      >
                        <rect width="100" height="100" fill="url(#pattern-ASSETS-BAR)" />
                      </svg>

                      {/* Hover highlight */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-100" />
                    </div>
                  )}

                  {/* Liabilities bar */}
                  {liabilitiesPercent > 0 && (
                    <div
                      style={{ width: `${liabilitiesPercent}%` }}
                      className="h-full relative inline-block transition-all duration-500 ease-out group"
                    >
                      {/* Base color */}
                      <div className="h-full w-full bg-[rgb(240,185,169)]" />

                      {/* Pattern overlay */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 100"
                      >
                        <rect width="100" height="100" fill="url(#pattern-LIABILITIES-BAR)" />
                      </svg>

                      {/* Hover highlight */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-100" />
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2.5">
                  {assetsPercent > 0 && (
                    <div className="flex items-center gap-2">
                      {/* Color dot */}
                      <div className="w-3 h-3 rounded-full shadow-sm bg-[rgb(60,99,0)]" />

                      {/* Text */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
                          Assets
                        </span>
                        <span className="text-[12px] font-semibold text-black dark:text-white">
                          {assetsPercent}%
                        </span>
                      </div>
                    </div>
                  )}
                  {liabilitiesPercent > 0 && (
                    <div className="flex items-center gap-2">
                      {/* Color dot */}
                      <div className="w-3 h-3 rounded-full shadow-sm bg-[rgb(240,185,169)]" />

                      {/* Text */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
                          Liabilities
                        </span>
                        <span className="text-[12px] font-semibold text-black dark:text-white">
                          {liabilitiesPercent}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}





        </div>