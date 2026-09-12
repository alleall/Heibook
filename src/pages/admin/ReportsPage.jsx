import React, { useState, useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { Button } from "../../components/common/Button";

export default function ReportsPage({ onNavigate }) {
  const { stats, books, borrowings, addToast } = useLibrary();

  const [timeframe, setTimeframe] = useState("This Month");

  const handleExportCSV = () => {
    addToast(
      "success",
      "Export Complete",
      `Circulation report for "${timeframe}" generated and downloaded as CSV.`
    );
  };

  const handleExportPDF = () => {
    addToast(
      "success",
      "PDF Generated",
      `Executive bibliographic audit ledger for "${timeframe}" rendered.`
    );
  };

  // Top borrowed books
  const topBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => b.borrowedCopies - a.borrowedCopies)
      .slice(0, 5);
  }, [books]);

  // Max weekly bar value for relative sizing
  const maxWeeklyValue = useMemo(() => {
    return Math.max(
      ...stats.weeklyCirculation.map((d) => Math.max(d.borrows, d.returns)),
      100
    );
  }, [stats.weeklyCirculation]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
              Circulation Reports & Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
              Executive Telemetry
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Archival access metrics, patron lending trends, and catalog utilization statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-surface-card border border-surface-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Academic Quarter">Academic Quarter</option>
            <option value="Fiscal Year 2024">Fiscal Year 2024</option>
          </select>

          <Button variant="secondary" size="sm" icon="table_chart" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" icon="picture_as_pdf" onClick={handleExportPDF}>
            Print PDF
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Total Transactions
            </span>
            <span className="material-symbols-outlined text-primary-600 text-xl">sync_alt</span>
          </div>
          <div className="font-serif text-3xl font-bold text-text-primary mt-2">1,482</div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +12.4% vs last period
          </p>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              On-Time Return Rate
            </span>
            <span className="material-symbols-outlined text-emerald-600 text-xl">task_alt</span>
          </div>
          <div className="font-serif text-3xl font-bold text-text-primary mt-2">96.2%</div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +1.8% institutional compliance
          </p>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Average Loan Duration
            </span>
            <span className="material-symbols-outlined text-sky-600 text-xl">schedule</span>
          </div>
          <div className="font-serif text-3xl font-bold text-text-primary mt-2">6.1 Days</div>
          <p className="text-xs text-text-muted mt-1">Within standard 7-day policy</p>
        </div>

        <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
              Fine Revenue Settled
            </span>
            <span className="material-symbols-outlined text-amber-600 text-xl">payments</span>
          </div>
          <div className="font-serif text-2xl font-bold text-text-primary mt-2">Rp1.480.000</div>
          <p className="text-xs text-text-muted mt-1">Allocated to conservation fund</p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Circulation Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-surface-card rounded-xl border border-surface-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-text-primary">
                Weekly Circulation Rhythm
              </h3>
              <p className="text-xs text-text-secondary">
                Daily comparisons of outbound borrow checkouts versus stack returns.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary-600"></span>
                <span className="text-text-secondary">Checkouts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="text-text-secondary">Returns</span>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-surface-border">
            {stats.weeklyCirculation.map((day) => {
              const borrowHeight = (day.borrows / maxWeeklyValue) * 100;
              const returnHeight = (day.returns / maxWeeklyValue) * 100;

              return (
                <div key={day.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Borrow Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-primary-600 rounded-t transition-all hover:brightness-110 relative"
                      style={{ height: `${borrowHeight}%` }}
                      title={`${day.day} Borrows: ${day.borrows}`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-text-primary text-surface-card px-1 rounded">
                        {day.borrows}
                      </span>
                    </div>

                    {/* Return Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-emerald-500 rounded-t transition-all hover:brightness-110 relative"
                      style={{ height: `${returnHeight}%` }}
                      title={`${day.day} Returns: ${day.returns}`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-text-primary text-surface-card px-1 rounded">
                        {day.returns}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-text-muted mt-2">{day.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted pt-1">
            <span>Peak circulation day: Saturday (88 checkouts)</span>
            <span>Minimal traffic day: Sunday (34 checkouts)</span>
          </div>
        </div>

        {/* Discipline Share */}
        <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Popular Academic Disciplines
            </h3>
            <p className="text-xs text-text-secondary">
              Share of catalog loans by subject branch.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {stats.popularDisciplines.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-text-primary">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-mono text-[11px]">{item.growth}</span>
                    <span className="text-text-muted font-mono">{item.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-surface-ground rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-surface-border text-xs text-text-muted leading-relaxed">
            Computer Science and Architecture maintain highest academic circulation demand this semester.
          </div>
        </div>
      </div>

      {/* Most Read Volumes Table */}
      <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Top Circulated Catalog Volumes
            </h3>
            <p className="text-xs text-text-secondary">
              Titles with highest cumulative loan frequency and patron reserve requests.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate && onNavigate("/admin/books")}
          >
            Manage Catalog
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-ground border-b border-surface-border text-xs uppercase font-semibold text-text-muted">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Volume Title & Author</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">Call Number (DDC)</th>
                <th className="py-3 px-4 text-center">Active Borrowed</th>
                <th className="py-3 px-4 text-center">Available in Stacks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary text-xs">
              {topBooks.map((book, index) => (
                <tr key={book.id} className="hover:bg-surface-ground/50 transition-colors">
                  <td className="py-3 px-4 font-serif font-bold text-primary-600 text-sm">
                    #{index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-7 h-10 object-cover rounded border border-surface-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-text-primary truncate max-w-[240px]">
                          {book.title}
                        </div>
                        <div className="text-text-muted truncate max-w-[240px]">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{book.categoryName}</td>
                  <td className="py-3 px-4 font-mono text-text-muted">{book.ddc}</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary-600">
                    {book.borrowedCopies}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono text-emerald-600 font-semibold">
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
