import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import TodoItem from './TodoItem'

function TodoList({ theme, todos, onToggle, onDelete, onEdit, onReorder, selectedTodoId, onSelect, enableDnd = true }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id)
      const newIndex = todos.findIndex(todo => todo.id === over.id)
      if (onReorder) {
        onReorder(arrayMove(todos, oldIndex, newIndex), active.id, over.id)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={enableDnd ? handleDragEnd : undefined}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={todos} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              theme={theme}
              todo={todo}
              isSelected={selectedTodoId === todo.id}
              onSelect={onSelect}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              isSortable={enableDnd}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default TodoList
