import type { ClientPackingListItem } from "$/transformers/packing-list-item";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EditableItemRow from "./editable-item-row";

export interface SortableItemListProps {
  items: ClientPackingListItem[];
  onReorder: (items: ClientPackingListItem[]) => void;
  onToggleOptional: (item: ClientPackingListItem) => void;
  onEditItem: (item: ClientPackingListItem) => void;
  onDeleteItem: (item: ClientPackingListItem) => void;
  autoEditItemId: number | null;
}

export default function SortableItemList({
  items,
  onReorder,
  onToggleOptional,
  onEditItem,
  onDeleteItem,
  autoEditItemId,
}: SortableItemListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <EditableItemRow
            key={item.id}
            item={item}
            onToggleOptional={() => onToggleOptional(item)}
            onEdit={onEditItem}
            onDelete={() => onDeleteItem(item)}
            autoEdit={item.id === autoEditItemId}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
