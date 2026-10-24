import { Directive, ElementRef, inject } from '@angular/core';

/** Grupo de botones de selección única: <div class="seg" data-seg>. */
@Directive({ selector: '[data-seg]', host: { '(click)': 'onClick($event)' } })
export class Seg {
  onClick(e: Event) {
    const host = e.currentTarget as HTMLElement;
    const btn = (e.target as HTMLElement).closest('button');
    if (!btn || !host.contains(btn)) return;
    host.querySelectorAll('button').forEach((b) => b.classList.remove('on'));
    btn.classList.add('on');
  }
}

/** Botón que se enciende y apaga: <button class="chip" data-chip>. */
@Directive({ selector: '[data-chip]', host: { '(click)': 'toggle()' } })
export class Chip {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  toggle() {
    this.el.nativeElement.classList.toggle('on');
  }
}

/** Chips de selección única (días y horarios): <div data-single>. */
@Directive({ selector: '[data-single]', host: { '(click)': 'onClick($event)' } })
export class Single {
  onClick(e: Event) {
    const host = e.currentTarget as HTMLElement;
    const chip = (e.target as HTMLElement).closest('.chip') as HTMLButtonElement | null;
    if (!chip || chip.disabled || !host.contains(chip)) return;
    host.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'));
    chip.classList.add('on');
  }
}
