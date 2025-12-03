import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TableGridSelectorProps {
    onSelect: (rows: number, cols: number) => void;
    maxRows?: number;
    maxCols?: number;
}

export function TableGridSelector({
    onSelect,
    maxRows = 8,
    maxCols = 8,
}: TableGridSelectorProps) {
    const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

    const handleCellHover = (row: number, col: number) => {
        setHoveredCell({ row, col });
    };

    const handleCellClick = (row: number, col: number) => {
        onSelect(row + 1, col + 1);
    };

    return (
        <div className="p-2">
            <div
                className="grid gap-1"
                style={{
                    gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                }}
                onMouseLeave={() => setHoveredCell(null)}
            >
                {Array.from({ length: maxRows * maxCols }).map((_, index) => {
                    const row = Math.floor(index / maxCols);
                    const col = index % maxCols;
                    const isHighlighted =
                        hoveredCell !== null &&
                        row <= hoveredCell.row &&
                        col <= hoveredCell.col;

                    return (
                        <button
                            key={index}
                            type="button"
                            className={cn(
                                'size-5 rounded-sm border transition-colors',
                                isHighlighted
                                    ? 'border-primary bg-primary/20'
                                    : 'border-border bg-background hover:border-muted-foreground'
                            )}
                            onMouseEnter={() => handleCellHover(row, col)}
                            onClick={() => handleCellClick(row, col)}
                        />
                    );
                })}
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
                {hoveredCell
                    ? `${hoveredCell.row + 1} × ${hoveredCell.col + 1}`
                    : 'Select size'}
            </div>
        </div>
    );
}
