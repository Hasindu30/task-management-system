import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "../../types";

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, pages, total, limit } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3">
      <p className="text-xs text-slate-500 order-2 sm:order-1">
        Showing <span className="font-semibold text-slate-700">{start}–{end}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span> task{total !== 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
            let pageNum: number;
            if (pages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= pages - 2) {
              pageNum = pages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                  pageNum === page
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
