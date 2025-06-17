import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Import RouterModule
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderId$: Observable<string | null>;

  constructor(private route: ActivatedRoute) {
    this.orderId$ = this.route.paramMap.pipe(
      map(params => params.get('id'))
    );
  }

  ngOnInit(): void {}
}
