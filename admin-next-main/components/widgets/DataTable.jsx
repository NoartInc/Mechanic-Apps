import React from 'react'
import { IconChevronLeft, IconChevronRight, IconChevronsRight, IconChevronsLeft, IconPlus } from "@tabler/icons";

const DataTable = ({ title }) => {
    const limits = [15, 25, 50, 100];
  return (
    <div className="p-3 rounded-lg shadow-sm flex flex-col bg-white">
        {/* Data Table Header */}
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="flex-shrink-0">
            <h5 className="text-xl font-semibold">{title}</h5>
          </div>
          <div className="flex-grow"></div>
          <div className="flex-shrink-0">
            <div className="flex flex-row items-center gap-x-2">
                <input className="input hidden md:block" placeholder="Search Disini" />
              <button type="button" className="button button-primary">
                <span className="block md:hidden">
                  <IconPlus />
                </span>
                <span className="hidden md:block">Tambah</span>
              </button>
            </div>
          </div>
        </div>
        {/* Data Body Table */}
        <div className="relative overflow-x-auto mb-3 overflow-y-auto" style={{ maxHeight: 360 }}>
          <table className="table-auto border-collapse border border-slate-200 w-full">
            <thead>
                <tr className="sticky top-0">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(col => (
                    <th key={col} className="bg-slate-200 text-left p-2 border border-slate-300">Head {col}</th>
                  ))}
                </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(item => (
                <tr key={item}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(col => (
                    <td className="border border-slate-200 p-2" style={{ minWidth: 120}} key={col}>Kolom {col}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Data Footer Table */}
        <div className="flex flex-row items-center justify-center gap-x-3">
            <div className="flex flex-row gap-x-2 items-center hidden md:block">
              <span>Rows</span>
              <select className="input">
                {limits.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-shrink hidden md:block">
              1 - 5 dari 5
            </div>
            <div className="flex-shrink flex flex-row gap-x-1 items-center justify-end">
                <button type="button" className="icon-button">
                  <IconChevronsLeft />
                </button>
                <button type="button" className="icon-button">
                  <IconChevronLeft />
                </button>
                <button type="button" className="icon-button">
                  <IconChevronRight />
                </button>
                <button type="button" className="icon-button">
                  <IconChevronsRight />
                </button>
            </div>
        </div>
      </div>
  )
}

export default DataTable