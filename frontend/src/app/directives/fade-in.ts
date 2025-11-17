// import { Directive, ElementRef, HostBinding, AfterViewInit } from '@angular/core';

// @Directive({
//   selector: '[appFadeIn]'
// })
// export class FadeIn implements AfterViewInit {
//   @HostBinding('class.visible') isVisible = false;

//   constructor(private el: ElementRef) {}

//   ngAfterViewInit() {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           this.isVisible = true;
//           observer.unobserve(this.el.nativeElement);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     observer.observe(this.el.nativeElement);
//   }
// }
