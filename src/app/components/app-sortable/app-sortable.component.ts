import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';


const DISABLED_STATE_INDEX = -1;

@Component({
    selector: 'app-sortable',
    templateUrl: './app-sortable.component.html',
    styleUrls: ['./app-sortable.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class AppSortableComponent {
    @Input() items: unknown[] = [];
    @Input() sortable: boolean = true;

    @Output() public listSorted: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();

    @ContentChild(TemplateRef) itemTemplate!: TemplateRef<{$implicit: any}>;

    startDragIndex: number = DISABLED_STATE_INDEX;
    currentDraggingIndex: number = DISABLED_STATE_INDEX;
    targetDropIndex: number = DISABLED_STATE_INDEX;

    get isDraggable(): boolean {
        return this.sortable && this.items.length > 1;
    }

    onDrop(): void {
        if (this.startDragIndex !== this.currentDraggingIndex) {
            this.listSorted.emit(this.items);
        }

        this.startDragIndex = DISABLED_STATE_INDEX;
        this.currentDraggingIndex = DISABLED_STATE_INDEX;
        this.targetDropIndex = DISABLED_STATE_INDEX;
    }

    allowDrop(event: Event, index: number): void {
        // nop if we drop external item over the item[index]
        if (this.currentDraggingIndex < 0) {
            return;
        }

        this.targetDropIndex = index;
        event.preventDefault();

        this.swapElements(this.currentDraggingIndex, index);
        this.currentDraggingIndex = index;
    }

    onDragStart(index: number): void {
        if (this.sortable) {
            this.startDragIndex = index;
            this.currentDraggingIndex = index;
        }
    }

    private swapElements(oldIndex: number, newIndex: number): void {
        const item = this.items[oldIndex];

        this.items.splice(oldIndex, 1);
        this.items.splice(newIndex, 0, item);
    }
}
