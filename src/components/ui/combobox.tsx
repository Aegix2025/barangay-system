"use client";

import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ComboboxContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  items: any[];
  filter: string;
  setFilter: (filter: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLDivElement>;
}

const ComboboxContext = React.createContext<ComboboxContextType | undefined>(undefined);

const useCombobox = () => {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error("Combobox components must be used within a Combobox");
  }
  return context;
};

interface ComboboxProps {
  items: any[];
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Combobox({ items, value = "", onValueChange, children }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setFilter("");
    }
  }, [open]);

  return (
    <ComboboxContext.Provider
      value={{
        open,
        setOpen,
        value,
        onValueChange: onValueChange || (() => {}),
        items,
        filter,
        setFilter,
        inputRef,
        listRef,
      }}
    >
      <div className="relative w-full">{children}</div>
    </ComboboxContext.Provider>
  );
}

interface ComboboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function ComboboxInput({ placeholder, className, ...props }: ComboboxInputProps) {
  const { open, setOpen, setFilter, value, items, filter, inputRef, listRef, onValueChange } =
    useCombobox();

  const displayValue = useMemo(() => {
    if (!value) return "";
    const item = items.find((item) => item.value === value);
    return item?.label || "";
  }, [value, items]);

  const handleFocus = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (listRef.current && listRef.current.contains(relatedTarget)) {
      return;
    }
    setFilter("");
    setOpen(false);
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
    if (!open) {
      setFilter("");
    }
  };

  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onValueChange) {
      onValueChange("");
    }
    setFilter("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={filter || displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "w-full px-3 py-2.5 text-xs bg-slate-50 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-black pr-8",
          className
        )}
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={clearValue}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleOpen}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface ComboboxContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ComboboxContent({ children, className }: ComboboxContentProps) {
  const { open, listRef } = useCombobox();

  if (!open) return null;

  return (
    <div
      ref={listRef}
      className={cn(
        "absolute top-full left-0 right-0 mt-1 bg-white border border-black rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ComboboxListProps {
  children: (item: any) => React.ReactNode;
}

export function ComboboxList({ children }: ComboboxListProps) {
  const { items, filter, value, onValueChange, setOpen, setFilter } = useCombobox();

  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  if (items.length === 0 || filteredItems.length === 0) {
    return null;
  }

  return (
    <>
      {filteredItems.map((item) => (
        <div
          key={item.value}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            onValueChange(item.value);
            setFilter("");
            setOpen(false);
          }}
          className={cn(
            "px-3 py-2 text-xs hover:bg-slate-100 cursor-pointer transition-colors",
            value === item.value ? "bg-slate-100 font-semibold" : ""
          )}
        >
          {children(item)}
        </div>
      ))}
    </>
  );
}

interface ComboboxItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function ComboboxItem({ children, value, className }: ComboboxItemProps) {
  const { value: selectedValue } = useCombobox();
  return (
    <div
      className={cn(
        "px-3 py-2 text-xs hover:bg-slate-100 cursor-pointer transition-colors",
        selectedValue === value ? "bg-slate-100 font-semibold" : "",
        className
      )}
    >
      {children}
    </div>
  );
}