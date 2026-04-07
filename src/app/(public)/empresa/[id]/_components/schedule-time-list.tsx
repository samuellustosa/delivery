// src/app/(public)/empresa/[id]/_components/category-list.tsx
"use client"

import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface CategoryListProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => onSelectCategory("")}
        variant="outline"
        className={cn(
          "rounded-full px-6",
          selectedCategory === "" && "bg-emerald-500 text-white border-emerald-500"
        )}
      >
        Todos
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          variant="outline"
          className={cn(
            "rounded-full px-6",
            selectedCategory === cat.id && "bg-emerald-500 text-white border-emerald-500"
          )}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  )
}