import { Directive, ElementRef, computed, inject, input, output, signal } from '@angular/core';

export type DragBounds = 'viewport' | 'parent' | 'none';

export interface DragPosition {
  x: number;
  y: number;
}

interface Limits {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Makes any element draggable with Pointer Events (mouse + touch + pen).
 * Movement is applied as a translate3d on the host, plus a small rotation
 * driven by horizontal velocity for a "physical sticker" feel.
 *
 * Note: it owns the host `transform`, so put CSS animations that also use
 * transform on an inner element.
 */
@Directive({
  selector: '[appDraggable]',
  host: {
    class: 'is-draggable',
    '[class.is-dragging]': 'dragging()',
    '[style.transform]': 'transform()',
    '[style.touch-action]': '"none"',
    '[style.cursor]': 'dragDisabled() ? null : dragging() ? "grabbing" : "grab"',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerUp($event)',
  },
})
export class Draggable {
  readonly dragDisabled = input(false);
  readonly bounds = input<DragBounds>('viewport');
  readonly rotation = input(0);

  readonly dragStart = output<void>();
  readonly dragEnd = output<DragPosition>();

  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  readonly dragging = signal(false);
  readonly position = signal<DragPosition>({ x: 0, y: 0 });
  private readonly swing = signal(0);

  protected readonly transform = computed(() => {
    const { x, y } = this.position();
    const scale = this.dragging() ? 1.08 : 1;
    return `translate3d(${x}px, ${y}px, 0) rotate(${this.rotation() + this.swing()}deg) scale(${scale})`;
  });

  private grabOffset: DragPosition = { x: 0, y: 0 };
  private limits: Limits | null = null;
  private lastClientX = 0;

  protected onPointerDown(event: PointerEvent): void {
    if (this.dragDisabled() || event.button !== 0) return;
    event.preventDefault();

    this.el.setPointerCapture(event.pointerId);
    const { x, y } = this.position();
    this.grabOffset = { x: event.clientX - x, y: event.clientY - y };
    this.lastClientX = event.clientX;
    this.limits = this.computeLimits();
    this.dragging.set(true);
    this.dragStart.emit();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) return;

    let x = event.clientX - this.grabOffset.x;
    let y = event.clientY - this.grabOffset.y;
    if (this.limits) {
      x = clamp(x, this.limits.minX, this.limits.maxX);
      y = clamp(y, this.limits.minY, this.limits.maxY);
    }

    this.swing.set(clamp((event.clientX - this.lastClientX) * 0.8, -15, 15));
    this.lastClientX = event.clientX;
    this.position.set({ x, y });
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.dragging()) return;
    if (this.el.hasPointerCapture(event.pointerId)) this.el.releasePointerCapture(event.pointerId);
    this.dragging.set(false);
    this.swing.set(0);
    this.dragEnd.emit(this.position());
  }

  reset(): void {
    this.position.set({ x: 0, y: 0 });
  }

  /** Translation range that keeps the element inside its bounds. */
  private computeLimits(): Limits | null {
    const mode = this.bounds();
    if (mode === 'none') return null;

    const rect = this.el.getBoundingClientRect();
    const box =
      mode === 'parent' && this.el.parentElement
        ? this.el.parentElement.getBoundingClientRect()
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    const { x, y } = this.position();

    return {
      minX: x + box.left - rect.left,
      maxX: x + box.right - rect.right,
      minY: y + box.top - rect.top,
      maxY: y + box.bottom - rect.bottom,
    };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
