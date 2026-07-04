'use client';

type Category = 'appetizer' | 'main' | 'dessert' | 'beverage' | 'all';

interface CategoryFilterProps {
  selected: Category;
  onChange: (category: Category) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const categories: { label: string; value: Category }[] = [
    { label: 'All', value: 'all' },
    { label: 'Appetizers', value: 'appetizer' },
    { label: 'Mains', value: 'main' },
    { label: 'Desserts', value: 'dessert' },
    { label: 'Beverages', value: 'beverage' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onChange(category.value)}
          className={`rounded-full px-4 py-2 font-medium transition-all ${
            selected === category.value
              ? 'bg-menu-accent text-white shadow-lg'
              : 'border border-menu-border bg-white text-menu-text hover:border-menu-accent'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
