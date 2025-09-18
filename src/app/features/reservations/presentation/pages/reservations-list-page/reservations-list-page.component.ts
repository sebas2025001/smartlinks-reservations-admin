import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { Observable } from 'rxjs';
import { ReservationsFacade } from '../../../application/facades/reservations.facade';
import { ReservationBase } from '../../../../../shared/domain/models/reservation-base.model';
import { UiConfigService } from '../../../../../shared/services/ui-config.service';
import { inject } from '@angular/core';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-reservations-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    TagModule,
    ToastModule,
    InputTextModule,
    PaginatorModule,
    CheckboxModule
  ],
  templateUrl: './reservations-list-page.component.html',
  styleUrls: ['./reservations-list-page.component.scss']
})
export class ReservationsListPageComponent implements OnInit {
  reservations$: Observable<ReservationBase[]>;
  loading$: Observable<boolean>;
  
  // Search and filter properties
  searchTerm: string = '';
  selectedPaymentStatus: string = 'all';
  selectedReservationStatus: string = 'all';
  
  // Date range properties
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // Pagination properties
  pageSize: number = 10;
  
  // Export loading state
  exporting: boolean = false;
  
  // Dropdown options
  paymentStatusOptions: DropdownOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Pago Exitoso', value: 'success' },
    { label: 'Pago Pendiente', value: 'pending' },
    { label: 'Pago Fallido', value: 'failed' }
  ];
  
  reservationStatusOptions: DropdownOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Confirmada', value: 'confirmed' },
    { label: 'Pendiente', value: 'pending' },
    { label: 'Cancelada', value: 'cancelled' },
    { label: 'Emitida', value: 'issued' }
  ];
  
  pageSizeOptions: DropdownOption[] = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
  ];

  private uiConfigService = inject(UiConfigService);

  constructor(private reservationsFacade: ReservationsFacade) {
    this.reservations$ = this.reservationsFacade.reservations$;
    this.loading$ = this.reservationsFacade.loading$;
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationsFacade.loadReservations();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFiltersChange(): void {
    this.applyFilters();
  }

  onDateRangeChange(): void {
    this.applyFilters();
  }

  onPageSizeChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    // Apply all current filters and reload data
    this.loadReservations();
  }

  onExport(): void {
    this.exporting = true;
    // Implement export functionality
    setTimeout(() => {
      this.exporting = false;
    }, 2000);
  }

  formatDateTime(date: Date): string {
    return this.uiConfigService.formatDate(date);
  }

  formatValue(reservation: ReservationBase): string {
    return this.uiConfigService.formatCurrency(reservation.totalAmount || 0);
  }

  getPaymentStatusSeverity(status: string): string {
    switch (status) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'info';
    }
  }

  getReservationStatusSeverity(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'issued':
        return 'info';
      default:
        return 'info';
    }
  }

  getPaymentStatusLabel(status: string): string {
    switch (status) {
      case 'success':
        return 'Pago Exitoso';
      case 'pending':
        return 'Pago Pendiente';
      case 'failed':
        return 'Pago Fallido';
      default:
        return status;
    }
  }

  getReservationStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pago Pendiente';
      case 'cancelled':
        return 'Cancelada';
      case 'issued':
        return 'Emitida';
      default:
        return status;
    }
  }
}